import { jsPDF } from "jspdf";
import { loadImage } from "./loadImage";
import { formatCurrency } from "./formatCurrency";
import { ImageDataType } from "../models/ImageData.type";
import { sanitizer } from "./santizeFIleName";
import axios from "axios";
import { formatDate } from "./formatDate";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const fieldOrder = [
  "Collateral Owner",
  "Collateral",
  "Inventory Market Value",
  "Inventory Liquidation Value",
  "Vehicle Mortgage",
  "Land & Building Mortgage",
  "HG",
  "BA",
  "INV",
  "VMG",
  "LBMG",
  "Others",
  "Collateral Owner Name",
  "Collateral Owner Signature Date",
  "Witness Name",
  "Witness Signature Date",
];

const nestedFieldOrder: Record<string, string[]> = {
  Collateral: [
    "Collateral Type",
    "Collateral Desc of item",
    "Collateral Year of Purchase",
    "Collateral Purchase Value",
    "Collateral Market Value",
    "Collateral Liquidation Value",
  ],
  "Vehicle Mortgage": [
    "Vehicle Mortgage Year",
    "Vehicle Mortgage Color",
    "Vehicle Mortgage Type",
    "Vehicle Mortgage Reg No",
    "Vehicle Mortgage Engine No",
    "Vehicle Mortgage Chasis No",
    "Vehicle Mortgage Purchase Value",
    "Vehicle Mortgage Market Value",
    "Vehicle Mortgage Liquidation Value",
  ],
  "Land & Building Mortgage": [
    "Land & Building Market Value",
    "Land & Building Force Sale Value",
    "Land & Building Description",
  ],
};

function showErrorNotification(message: string) {
  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    style: { background: "#f56565", color: "#fff" },
  });
}

function showSuccessNotification(message: string) {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    style: { background: "#48bb78", color: "#fff" },
  });
}

export async function submit(
  data: Record<string, any>,
  images: { owner: ImageDataType[]; witness: ImageDataType[] },
  reset: () => void,
  setIsLoading: (value: boolean) => void,
  setSignature: (value: { owner: boolean; witness: boolean }) => void,
  setSignaturePic: (value: { owner: ""; witness: "" }) => void
) {
  console.log("clicked");

  try {
    const orderedData: Record<string, any> = {};

    fieldOrder.forEach((key) => {
      if (Array.isArray(data[key]) && nestedFieldOrder[key]) {
        orderedData[key] = data[key].map((item) => {
          return nestedFieldOrder[key].reduce(
            (acc: Record<string, any>, subKey: any) => {
              acc[subKey] = item[subKey] || "";
              return acc;
            },
            {}
          );
        });
      } else {
        orderedData[key] = data[key] || "";
      }
    });

    const doc = new jsPDF();

    const marginX = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const lineHeight = 7;
    let cursorY = 37;
    const maxWidth = pageWidth - marginX * 2;

    const title = "Guarantor Assessment Form";
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(24);
    const titleWidth = doc.getTextWidth(title);
    const titlePositionX = (pageWidth - titleWidth) / 2;
    const titlePositionY = 20;

    doc.text(title, titlePositionX, titlePositionY);

    doc.setLineWidth(0.5);
    doc.line(
      titlePositionX,
      titlePositionY + 2,
      titlePositionX + titleWidth,
      titlePositionY + 2
    );

    const logo = await loadImage("/mfb-logo.png");
    if (logo) {
      doc.addImage(logo, "PNG", maxWidth - 16, 5, 20, 20);
    }

    if (orderedData.length < 1) return;
    console.log("ordered:", orderedData);
    Object.keys(orderedData).forEach((key) => {
      const value = orderedData[key];

      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (typeof item === "object") {
            Object.keys(item).forEach((subKey) => {
              const subValue = item[subKey];
              const keyText = `${subKey}:  `;
              let valueText = subValue;

              if (keyText.toLowerCase().includes("date")) {
                valueText = formatDate(subValue);
              } else if (
                keyText.toLowerCase().includes("value") ||
                keyText.toLowerCase().includes("purchase")
              ) {
                valueText = formatCurrency(subValue);
              }

              const keyWidth = doc.getTextWidth(keyText);
              const remainingWidth = maxWidth - keyWidth;
              const splittedValue = doc.splitTextToSize(
                valueText,
                remainingWidth
              );
              const totalItemHeight = splittedValue.length * lineHeight;

              if (cursorY + totalItemHeight > pageHeight - marginX) {
                doc.addPage();
                cursorY = 20;
              }

              if (splittedValue.length > 0) {
                doc.setFontSize(16);
                doc.setFont("Helvetica", "normal");
                doc.text(keyText + splittedValue[0], marginX, cursorY);
                for (let i = 1; i < splittedValue.length; i++) {
                  doc.text(
                    splittedValue[i],
                    marginX + keyWidth,
                    cursorY + i * lineHeight
                  );
                }
              }

              cursorY += splittedValue.length * lineHeight + lineHeight;
            });
          }
        });
      } else {
        const keyText = `${key}:  `;
        let valueText = value || "";

        if (keyText.toLowerCase().includes("date")) {
          valueText = formatDate(valueText);
        } else if (
          keyText.toLowerCase().includes("value") ||
          keyText.toLowerCase().includes("purchase")
        ) {
          valueText = formatCurrency(valueText);
        }

        const keyWidth = doc.getTextWidth(keyText);
        const remainingWidth = maxWidth - keyWidth;
        const splittedValue = doc.splitTextToSize(valueText, remainingWidth);
        const totalItemHeight = splittedValue.length * lineHeight;

        if (cursorY + totalItemHeight > pageHeight - marginX) {
          doc.addPage();
          cursorY = 20;
        }

        if (splittedValue.length > 0) {
          doc.setFontSize(16);
          doc.setFont("Helvetica", "normal");
          doc.text(keyText + splittedValue[0], marginX, cursorY);
          for (let i = 1; i < splittedValue.length; i++) {
            doc.text(
              splittedValue[i],
              marginX + keyWidth,
              cursorY + i * lineHeight
            );
          }
        }

        cursorY += splittedValue.length * lineHeight + lineHeight;
      }
    });
    const pdfBuffer = doc.output("arraybuffer");
    const base64Pdf = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      if (!reader) return;
      reader.onloadend = () => resolve(reader.result?.toString().split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(new Blob([pdfBuffer]));
    });

    const imageAttachment = [
      ...images.owner.map((img) => {
        if (!img.mimeType || !img.base64) return null;

        if (!img.base64.startsWith("data:")) {
          img.base64 = `data:${img.mimeType};base64,${img.base64}`;
        }

        return {
          content: img.base64.split(",")[1],
          name: sanitizer(img.name)
            ? `${sanitizer(img.name)}.${img.mimeType.split("/")[1]}`
            : undefined,
          contentType: img.mimeType,
        };
      }),
      ...images.witness.map((img) => {
        if (!img.mimeType || !img.base64) return null;

        if (!img.base64.startsWith("data:")) {
          img.base64 = `data:${img.mimeType};base64,${img.base64}`;
        }

        return {
          content: img.base64.split(",")[1],
          name: sanitizer(img.name)
            ? `${sanitizer(img.name)}.${img.mimeType.split("/")[1]}`
            : undefined,
          contentType: img.mimeType,
        };
      }),
    ].filter(Boolean);

    if (imageAttachment.length < 1) return;

    const emailData = {
      sender: {
        name: "Unilag Microfinance Bank",
        email: "info@unilagmfbank.com",
      },
      to: [{ email: "aadebajo@unilagmfbank.com", name: "UMFB" }],
      subject: "Guarantor Assessment Form Submission",
      htmlContent: "<b>Please find the attached loan form and images.</b>",
      attachment: [
        {
          content: base64Pdf,
          name: "Guarantor-Assessment-Form.pdf",
          type: "application/pdf",
        },
        ...imageAttachment,
      ],
    };
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        emailData,
        {
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            "api-key": import.meta.env.VITE_BREVO_API_KEY,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        showSuccessNotification("Loan request submitted!");
        setSignature({ owner: false, witness: false });
        setSignaturePic({ owner: "", witness: "" });
        reset();
      } else {
        showErrorNotification("Failed to send email.");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  } catch (error) {
    console.log(error);
    setIsLoading(false);
  }
}
