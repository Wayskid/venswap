import React, { useContext, useState } from "react";
import AppModalBox from "../../components/reuseable/AppModalBox";
import appContext from "../../contexts/AppContext";
import { useReportBusinessMutation } from "../../services/appApi";
import { useParams } from "react-router-dom";
import SelectInput from "../../components/reuseable/SelectInput";
import AppButtons from "../../components/reuseable/AppButtons";

export default function ReportBusiness({ seller_id, setShowReport }) {
  const { business_id } = useParams();
  const { userInfo, token } = useContext(appContext);
  const [reportVal, setReportVal] = useState({ subject: "", description: "" });
  const [reportSuccess, setReportSuccess] = useState(false);

  const [reportBusinessApi, { isLoading: isReporting, error, isError }] =
    useReportBusinessMutation();

  const reportSubjects = [
    "Abuse & Harassment",
    "Child Safety",
    "Spam",
    "Sensitive or disturbing media",
    "Impersonation",
  ];

  function handleReportBusiness(e) {
    e.preventDefault();

    reportBusinessApi({
      token,
      user_id: userInfo._id,
      business_id,
      body: { ...reportVal, seller_id },
    })
      .unwrap()
      .then((res) => {
        setReportSuccess(true);
        setReportVal({
          subject: "",
          description: "",
        });
      });
  }

  return (
    <AppModalBox show={true}>
      {reportSuccess ? (
        <div className="grid text-center">
          <p className="text-4xl mb-5">Your report has been sent</p>
          <button
            className="bg-Blue text-White py-3"
            onClick={() => setShowReport(false)}
          >
            Done
          </button>
        </div>
      ) : (
        <div className="">
          <p className="text-2xl font-semibold text-center">Report an issue</p>
          <form onSubmit={handleReportBusiness} className="mt-10 grid gap-5">
            <div className="grid w-full">
              <label htmlFor="listing_summary" className="text-lg font-medium">
                What type of issue
              </label>
              <SelectInput
                options={reportSubjects.map((opt) => ({
                  label: opt,
                  value: opt,
                }))}
                value={reportVal.subject}
                onChange={(e) =>
                  setReportVal({ ...reportVal, subject: e.target.value })
                }
                placeholder="Select type of issue"
                required={true}
              />
            </div>
            <div className="grid w-full">
              <label htmlFor="description" className="text-lg">
                Describe the issue
              </label>
              <textarea
                type="text"
                id="description"
                name="description"
                row={5}
                className="p-2 md:p-3 border border-gray-400 outline-none text-lg bg-transparent placeholder:text-white placeholder:italic placeholder:font-normal focus:placeholder:text-transparent placeholder:transition-all px-2 md:px-3 focus:border-Blue rounded-sm w-full"
                value={reportVal.description}
                onChange={(e) =>
                  setReportVal({
                    ...reportVal,
                    description: e.target.value,
                  })
                }
                required
              />
            </div>
            {isError && <p className="text-red-400">{error.data}</p>}
            <div className="grid gap-2">
              <AppButtons
                label={isReporting ? "Reporting..." : "Report"}
                className="bg-Blue text-White disabled:opacity-60"
                isDisabled={
                  isReporting ||
                  Object.values(reportVal).some((val) => val.length < 1)
                }
              />
              <AppButtons
                label="Cancel"
                className="text-Blue"
                type="button"
                onClick={() => {
                  setShowReport(false);
                  setReportVal({
                    subject: "",
                    description: "",
                  });
                }}
              />
            </div>
          </form>
        </div>
      )}
    </AppModalBox>
  );
}
