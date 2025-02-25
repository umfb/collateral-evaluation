import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema } from "../components/schemas/FormSchema";
// import { FormDataType } from "../models/FormDate.type";
import { ToastContainer } from "react-toastify";
import NavBar from "../components/NavBar";
import FormHeader from "../components/FormHeader";
import MiniHeader from "../components/MiniHeader";

export default function Form() {
  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      Collateral: [
        {
          "Collateral Type": "",
          "Collateral Desc of item": "",
          "Collateral Liquidation Value": "",
          "Collateral Market Value": "",
          "Collateral Purchase Value": "",
          "Collateral Year of Purchase": "",
        },
      ],
      "Vehicle Mortgage": [
        {
          "Vehicle Mortgage Year": "",
          "Vehicle Mortgage Type": "",
          "Vehicle Mortgage Chasis No": "",
          "Vehicle Mortgage Color": "",
          "Vehicle Mortgage Engine No": "",
          "Vehicle Mortgage Liquidation Value": "",
          "Vehicle Mortgage Market Value": "",
          "Vehicle Mortgage Purchase Value": "",
          "Vehicle Mortgage Reg No": "",
        },
      ],
      "Land & Building Mortgage": [
        {
          "Land & Building Description": "",
          "Land & Building Force Sale Value": "",
          "Land & Building Market Value": "",
        },
      ],
    },
  });

  const {
    fields: collateralFields,
    append: addCollateral,
    remove: removeCollateral,
  } = useFieldArray({
    control,
    name: "Collateral",
  });

  const {
    fields: vmFields,
    append: addVm,
    remove: removeVm,
  } = useFieldArray({
    control,
    name: "Vehicle Mortgage",
  });
  const {
    fields: LBMGFields,
    append: addLBMG,
    remove: removeLBMG,
  } = useFieldArray({
    control,
    name: "Land & Building Mortgage",
  });

  const onSubmit = (data: Record<string, any>) => {
    console.log("clicked");

    console.log(data);
  };

  const handleClick = () => {
    console.log("btn clicked");
  };

  return (
    <div className="border mx-auto md:p-5 py-5 overflow-auto h-screen relative">
      <div className="fixed top-0 left-0 text-center h-[150px] bg-white z-10 w-full shadow-md">
        <NavBar />
      </div>
      <div className="h-fit py-10 lg:w-[70%] w-full mx-auto mt-[150px] border-1 border-[#800] md:px-8 px-2 rounded-lg">
        <FormHeader title="GUARANTOR ASSESSMENT" />
        <form
          onSubmit={handleSubmit(onSubmit, (errors) =>
            console.log("errors:", errors)
          )}
          className="flex flex-col gap-3 mx-auto md:px-3 mt-3 inter"
        >
          {collateralFields.map((field, index) => (
            <div className="flex flex-col gap-2" key={field.id}>
              <MiniHeader title={`Collateral ${index + 1}`} />
              <div className="row mt-3">
                <div className="wrapper-custom col-12 col-lg-4">
                  <label className="font-bold" htmlFor="">
                    Type
                  </label>
                  <input
                    {...register(`Collateral.${index}.Collateral Type`)}
                    className="input-custom"
                    placeholder="Type"
                    type="text"
                  />
                </div>
                <div className="wrapper-custom col-12 col-lg-4">
                  <label htmlFor="" className="font-bold w-full truncate">
                    Description of Item (Color, Make, Model, S/No)
                  </label>
                  <input
                    {...register(`Collateral.${index}.Collateral Desc of item`)}
                    type="text"
                    placeholder="Description"
                    className="input-custom"
                  />
                </div>
                <div className="wrapper-custom col-12 col-lg-4">
                  <label htmlFor="" className="font-bold">
                    Year of Purchase
                  </label>
                  <input
                    {...register(
                      `Collateral.${index}.Collateral Year of Purchase`
                    )}
                    type="text"
                    placeholder="Year of Purchase"
                    className="input-custom"
                  />
                </div>
              </div>
              <div className="row mt-2">
                <div className="wrapper-custom col-12 col-lg-4">
                  <label className="font-bold" htmlFor="">
                    Purchase Value
                  </label>
                  <input
                    {...register(
                      `Collateral.${index}.Collateral Purchase Value`
                    )}
                    className="input-custom"
                    placeholder="Purchase Value"
                    type="text"
                  />
                </div>
                <div className="wrapper-custom col-12 col-lg-4">
                  <label htmlFor="" className="font-bold w-full truncate">
                    Market Value
                  </label>
                  <input
                    {...register(`Collateral.${index}.Collateral Market Value`)}
                    type="text"
                    placeholder="Market Value"
                    className="input-custom"
                  />
                </div>
                <div className="wrapper-custom col-12 col-lg-4">
                  <label htmlFor="" className="font-bold">
                    Liquidation Value
                  </label>
                  <input
                    {...register(
                      `Collateral.${index}.Collateral Liquidation Value`
                    )}
                    type="text"
                    placeholder="Liquidation Value"
                    className="input-custom"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeCollateral(index)}
                className="bg-red-500 text-white px-2 py-1 rounded mt-2 w-fit disabled:bg-red-300 disabled:cursor-not-allowed"
                disabled={index === 0}
              >
                Remove
              </button>
            </div>
          ))}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() =>
                addCollateral({
                  "Collateral Type": "",
                  "Collateral Desc of item": "",
                  "Collateral Liquidation Value": "",
                  "Collateral Market Value": "",
                  "Collateral Purchase Value": "",
                  "Collateral Year of Purchase": "",
                })
              }
              className="bg-green-500 text-white px-2 py-1 rounded w-fit"
            >
              <span className="text-sm"> Add Collateral</span>
            </button>
          </div>
          <div className="mt-2">
            <MiniHeader title="INVENTORY" />
          </div>
          <div className="row">
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="" className="font-bold">
                Market Value
              </label>
              <input
                {...register("Inventory Market Value")}
                type="text"
                placeholder="Market Value"
                className="input-custom"
              />
            </div>
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="" className="font-bold">
                Liquidation Value
              </label>
              <input
                {...register("Inventory Liquidation Value")}
                type="text"
                placeholder="Liquidation Value"
                className="input-custom"
              />
            </div>
          </div>
          {vmFields.map((field, index) => (
            <div key={field.id}>
              <MiniHeader title={`Vehicle Mortgage ${index + 1}`} />
              <div className="row mt-3">
                <div className="wrapper-custom col-12 col-lg-4">
                  <label htmlFor="" className="font-bold">
                    Year
                  </label>
                  <input
                    {...register(
                      `Vehicle Mortgage.${index}.Vehicle Mortgage Year`
                    )}
                    type="text"
                    placeholder="Year"
                    className="input-custom"
                  />
                </div>
                <div className="wrapper-custom col-12 col-lg-4">
                  <label htmlFor="" className="font-bold">
                    Color
                  </label>
                  <input
                    {...register(
                      `Vehicle Mortgage.${index}.Vehicle Mortgage Color`
                    )}
                    type="text"
                    placeholder="Color"
                    className="input-custom"
                  />
                </div>
                <div className="wrapper-custom col-12 col-lg-4">
                  <label htmlFor="" className="font-bold">
                    Type
                  </label>
                  <input
                    {...register(
                      `Vehicle Mortgage.${index}.Vehicle Mortgage Type`
                    )}
                    type="text"
                    placeholder="Type"
                    className="input-custom"
                  />
                </div>
              </div>
              <div className="row">
                <div className="wrapper-custom col-12 col-lg-4">
                  <label htmlFor="" className="font-bold">
                    Registration Number
                  </label>
                  <input
                    {...register(
                      `Vehicle Mortgage.${index}.Vehicle Mortgage Reg No`
                    )}
                    type="text"
                    placeholder="Registration Number"
                    className="input-custom"
                  />
                </div>
                <div className="wrapper-custom col-12 col-lg-4">
                  <label htmlFor="" className="font-bold">
                    Engine Number
                  </label>
                  <input
                    {...register(
                      `Vehicle Mortgage.${index}.Vehicle Mortgage Engine No`
                    )}
                    type="text"
                    placeholder="Engine Number"
                    className="input-custom"
                  />
                </div>
                <div className="wrapper-custom col-12 col-lg-4">
                  <label htmlFor="" className="font-bold">
                    Chasis Number
                  </label>
                  <input
                    {...register(
                      `Vehicle Mortgage.${index}.Vehicle Mortgage Chasis No`
                    )}
                    type="text"
                    placeholder="Chasis Number"
                    className="input-custom"
                  />
                </div>
              </div>
              <div className="row">
                <div className="wrapper-custom col-12 col-lg-4">
                  <label htmlFor="" className="font-bold">
                    Purchase Value
                  </label>
                  <input
                    {...register(
                      `Vehicle Mortgage.${index}.Vehicle Mortgage Purchase Value`
                    )}
                    type="text"
                    placeholder="Purchase Value"
                    className="input-custom"
                  />
                </div>
                <div className="wrapper-custom col-12 col-lg-4">
                  <label htmlFor="" className="font-bold">
                    Market Value
                  </label>
                  <input
                    {...register(
                      `Vehicle Mortgage.${index}.Vehicle Mortgage Market Value`
                    )}
                    type="text"
                    placeholder="Market Value"
                    className="input-custom"
                  />
                </div>
                <div className="wrapper-custom col-12 col-lg-4">
                  <label htmlFor="" className="font-bold">
                    Liquidation Value
                  </label>
                  <input
                    {...register(
                      `Vehicle Mortgage.${index}.Vehicle Mortgage Liquidation Value`
                    )}
                    type="text"
                    placeholder="Liquidation Value"
                    className="input-custom"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeVm(index)}
                className="bg-red-500 text-white px-2 py-1 rounded mt-2 w-fit disabled:bg-red-300 disabled:cursor-not-allowed"
                disabled={index === 0}
              >
                Remove
              </button>
            </div>
          ))}
          <div className="flex justify-end">
            <button
              className="bg-green-500 py-1 px-2 rounded"
              onClick={() =>
                addVm({
                  "Vehicle Mortgage Year": "",
                  "Vehicle Mortgage Type": "",
                  "Vehicle Mortgage Chasis No": "",
                  "Vehicle Mortgage Color": "",
                  "Vehicle Mortgage Engine No": "",
                  "Vehicle Mortgage Liquidation Value": "",
                  "Vehicle Mortgage Market Value": "",
                  "Vehicle Mortgage Purchase Value": "",
                  "Vehicle Mortgage Reg No": "",
                })
              }
            >
              <span className="text-sm text-white">Add Vehicle Mortgage</span>
            </button>
          </div>
          {LBMGFields.map((field, index) => (
            <div key={field.id}>
              <MiniHeader title={`Land & Building Mortgage ${index + 1}`} />
              <div className="row mt-3">
                <div className="wrapper-custom col-12 col-lg-4">
                  <label htmlFor="" className="font-bold">
                    Description
                  </label>
                  <input
                    {...register(
                      `Land & Building Mortgage.${index}.Land & Building Description`
                    )}
                    type="text"
                    placeholder="Description"
                    className="input-custom"
                  />
                </div>
                <div className="wrapper-custom col-12 col-lg-4">
                  <label htmlFor="" className="font-bold">
                    Force Sale Value
                  </label>
                  <input
                    {...register(
                      `Land & Building Mortgage.${index}.Land & Building Force Sale Value`
                    )}
                    type="text"
                    placeholder="Force Sale Value"
                    className="input-custom"
                  />
                </div>
                <div className="wrapper-custom col-12 col-lg-4">
                  <label htmlFor="" className="font-bold">
                    Market Value
                  </label>
                  <input
                    {...register(
                      `Land & Building Mortgage.${index}.Land & Building Market Value`
                    )}
                    type="text"
                    placeholder="Market Value"
                    className="input-custom"
                  />
                </div>
              </div>
              <button
                className="bg-red-500 disabled:bg-red-300 disabled:cursor-not-allowed text-sm text-white rounded px-2 py-1"
                disabled={index === 0}
                onClick={() => removeLBMG(index)}
              >
                <span className="text-sm">Remove</span>
              </button>
            </div>
          ))}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() =>
                addLBMG({
                  "Land & Building Description": "",
                  "Land & Building Force Sale Value": "",
                  "Land & Building Market Value": "",
                })
              }
              className="bg-green-500 px-2 py-1 rounded"
            >
              <span className="text-sm text-white">Add LBMG</span>
            </button>
          </div>
          <MiniHeader title="COLLATERAL CLASSIFICATION SUMMARY" />
          <div className="row">
            <div className="wrapper-custom col-12 col-lg-4">
              <label htmlFor="" className="font-bold">
                Household Goods
              </label>
              <input
                {...register("HG")}
                type="text"
                placeholder="Household Goods"
                className="input-custom"
              />
            </div>
            <div className="wrapper-custom col-12 col-lg-4">
              <label htmlFor="" className="font-bold">
                Business Asset
              </label>
              <input
                {...register("BA")}
                type="text"
                placeholder="Business Asset"
                className="input-custom"
              />
            </div>
            <div className="wrapper-custom col-12 col-lg-4">
              <label htmlFor="" className="font-bold">
                Inventory
              </label>
              <input
                {...register("INV")}
                type="text"
                placeholder="Inventory"
                className="input-custom"
              />
            </div>
          </div>
          <div className="row">
            <div className="wrapper-custom col-12 col-lg-4">
              <label htmlFor="" className="font-bold">
                Vehicle Mortgage
              </label>
              <input
                {...register("VMG")}
                type="text"
                placeholder="Vehicle Mortgage"
                className="input-custom"
              />
            </div>
            <div className="wrapper-custom col-12 col-lg-4">
              <label htmlFor="" className="font-bold">
                Land & Building Mortgage
              </label>
              <input
                {...register("LBMG")}
                type="text"
                placeholder="Land & Building Mortgage"
                className="input-custom"
              />
            </div>
            <div className="wrapper-custom col-12 col-lg-4">
              <label htmlFor="" className="font-bold">
                Others
              </label>
              <input
                {...register("Others")}
                type="text"
                placeholder="Others"
                className="input-custom"
              />
            </div>
          </div>
          <button onClick={handleClick} type="submit">
            Submit
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
