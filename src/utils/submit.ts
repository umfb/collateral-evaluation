import { jsPDF } from "jspdf";
import { loadImage } from "./loadImage";
import { formatCurrency } from "./formatCurrency";
import { ImageDataType } from "../models/ImageData.type";
import { sanitizer } from "./santizeFIleName";
import axios from "axios";
import { formatDate } from "./formatDate";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const schemaOrder = [
  "Applicant Name",
  "Date of business visit",
  "Date of home visit",
  "Type of Guarantor",
  "Last Name",
  "Middle Name",
  "First Name",
  "Date of Birth",
  "Sex",
  "Relation with Client",
  "Type of ID",
  "ID Card Number",
  "Marital Status",
  "Spouse Name",
  "Spouse Phone Number",
  "House Address",
  "Residence Type",
  "First Phone Number",
  "Second Phone Number",
  "Business Name",
  "Business Address",
  "Business Address Age",
  "Business Activity",
  "Business Activity Age",
  "Business Premises",
  "Number of Employee",
  "Business Co-owned",
  "Number of Sales Point",
  "Sales",
  "Cost of Sales",
  "Operational Expenses",
  "Other Income",
  "Family Expense",
  "Repayment Capacity",
  "Cash and Bank",
  "Inventory",
  "Fixed Asset",
  "Total Asset",
  "Liability",
  "Equity",
  "Name of Company",
  "Company Address",
  "Designation",
  "Department/Unit",
  "Work Phone Number",
  "Company Email",
  "Years of Service",
  "Probation",
  "Name of Supervisor",
  "Supervisor Phone Number",
  "Net Pay",
];

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
  data: Record<string, string>,
  images: Array<ImageDataType>,
  reset: () => void,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setSignaturePic: Dispatch<SetStateAction<boolean>>
) {
  console.log("clicked");

  try {
    const orderedData: Record<string, string>[] = schemaOrder.map((key) => ({
      key,
      value: data[key],
    }));

    console.log(orderedData);
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
    orderedData
      .filter((item) => item.value !== "")
      .forEach((item) => {
        const keyText = `${item.key}:  `;
        const valueText = item.value;
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
          if (
            keyText.toLowerCase().includes("pay") ||
            keyText.toLowerCase().includes("cost") ||
            keyText.toLowerCase().includes("asset") ||
            keyText.toLowerCase().includes("liability") ||
            keyText.toLowerCase().includes("equity") ||
            keyText.toLowerCase().includes("income") ||
            keyText.toLowerCase().includes("cash") ||
            keyText.toLowerCase().includes("inventory") ||
            keyText.toLowerCase().includes("expense")
          ) {
            doc.text(
              keyText + formatCurrency(splittedValue[0]),
              marginX,
              cursorY
            );
          } else if (keyText.toLowerCase().includes("date")) {
            doc.text(keyText + formatDate(splittedValue[0]), marginX, cursorY);
          } else {
            doc.text(keyText + splittedValue[0], marginX, cursorY);
          }
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
    const pdfBuffer = doc.output("arraybuffer");
    const base64Pdf = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      if (!reader) return;
      reader.onloadend = () => resolve(reader.result?.toString().split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(new Blob([pdfBuffer]));
    });

    const imageAttachment = images
      .map((img) => {
        if (!img.mimeType || !img.base64) return;

        if (!img.base64.startsWith("data:")) {
          img.base64 = `data:${img.mimeType};base64,${img.base64}`;
        }

        return {
          content: img.base64.split(",")[1],
          name:
            sanitizer(img.name) &&
            `${sanitizer(img.name)}.${img.mimeType.split("/")[1]}`,
          contentType: img.mimeType,
        };
      })
      .filter(Boolean);

    if (imageAttachment.length < 1) return;

    const emailData = {
      sender: {
        name: "Unilag Microfinance Bank",
        email: "info@unilagmfbank.com",
      },
      to: [{ email: "accountopening@unilagmfbank.com", name: "UMFB" }],
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
        setSignaturePic(false);
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
