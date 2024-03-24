import { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../util/contexts.ts";
import { useNavigate } from "react-router-dom";
import TextInput from "../components/settings/TextInput";
import TFInput from "../components/settings/TFInput";
import LoadingSpinner from "../components/LoadingSpinner";
import CONFIG, {
  ERROR_TOAST_STYLES,
  SUCCESS_TOAST_STYLES,
} from "../util/config";
import { toast } from "react-hot-toast";
import { SignOut } from "@phosphor-icons/react";
import ScheduleEntryItem from "../components/settings/ScheduleEntryItem";

const SettingsPage = () => {
  const { userData, setUserData } = useContext(UserDataContext);
  const [editedSettings, setEditedSettings] = useState(null);
  const [changed, setChanged] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const nav = useNavigate();

  const isObjectChanged = (obj1, obj2) => {
    for (var key in obj1) {
      if (obj1[key] !== obj2[key]) return true;
    }
    return false;
  };

  useEffect(() => {
    if (userData && editedSettings == null) {
      setEditedSettings(userData.data);
    }
    // calculate if changed
    if (userData && editedSettings) {
      var change = false;
      for (var key in editedSettings) {
        if (typeof editedSettings[key] === "object") {
          change = isObjectChanged(editedSettings[key], userData.data[key]);
          if (change) break;
        } else if (editedSettings[key] !== userData.data[key]) {
          change = true;
          break;
        }
      }
      if (changed !== change) setChanged(change);
    }
  }, [userData, editedSettings, changed]);

  if (!userData || editedSettings == null)
    return (
      <div className="m-0 flex h-full flex-col items-center justify-center px-4 pt-4 md:ml-64">
        <p className="bigText text-center">Log in to view your settings</p>
        <hr className="m-4 w-full" />
        <p className="text-center">
          We need to know who you are to show you your settings.
        </p>
        <div className="h-8" />
        <button
          className="btn mt-8"
          onClick={(e) => {
            e.preventDefault();
            nav("/login?continue=/settings");
          }}
        >
          Log in
        </button>
      </div>
    );

  const updateEdits = (e, key, value) => {
    e.preventDefault();
    var newEdits = { ...editedSettings };
    newEdits[key] = value;
    setEditedSettings(newEdits);
  };

  const save = async (e) => {
    e.preventDefault();

    // verify all settings
    if (!checkValid()) return;
    forceTypes();

    var hehe = JSON.parse(JSON.stringify(editedSettings));
    hehe.userAgents = userData.data.userAgents;

    // save
    setSaving(true);
    await fetch(CONFIG.SERVER_URL + "/api/user/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: userData.data.uid,
        settings: hehe,
        token: userData.token,
      }),
    })
      .then((res) => {
        if (res.status !== 200) {
          toast.error("Failed to save settings.", ERROR_TOAST_STYLES);
          setSaving(false);
          return;
        }
        setUserData({ ...userData, data: editedSettings });
        toast.success("Saved settings!", SUCCESS_TOAST_STYLES);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to save settings.", ERROR_TOAST_STYLES);
      });
    setSaving(false);
  };

  const forceTypes = () => {
    // the types get forced correctly, but then devolve back?
    // TODO: fix this
    var newSettings = { ...editedSettings };
    if (typeof newSettings.grade != "number")
      newSettings.grade = parseInt(newSettings.grade);
    if (typeof newSettings.classNotification != "number")
      newSettings.classNotification = parseInt(newSettings.classNotification);

    setEditedSettings(newSettings);
  };

  const checkValid = () => {
    // grade
    if (editedSettings.grade !== -1) {
      var g = parseInt(editedSettings.grade);
      if (isNaN(g)) {
        setErrors({ ...errors, grade: "Grade must be a valid number." });
        return false;
      }
      if (g < 9 || g > 12) {
        setErrors({ ...errors, grade: "Grade must be between 9 and 12." });
        return false;
      }
      setErrors({ ...errors, grade: "" });
    }

    // class notifications
    var cn = parseInt(editedSettings.classNotification);
    if (isNaN(cn)) {
      setErrors({
        ...errors,
        cn: "Class notification must be a valid number.",
      });
      return false;
    }
    if (cn < -1 || cn > 15) {
      setErrors({
        ...errors,
        cn: "Class notification must be between 0 and 15.",
      });
      return false;
    }
    setErrors({ ...errors, cn: "" });

    return true;
  };

  return (
    <>
      <div className="m-0 flex h-full flex-col items-center justify-start px-4 pt-4 md:ml-64">
        <div className="flex w-full flex-col items-center justify-between md:flex-row">
          <p className="bigText text-left">
            Settings for {userData.data.displayName}
          </p>
          <div
            className="flex cursor-pointer flex-row items-center justify-center gap-2 rounded p-3 px-6 hover:bg-gray-100"
            onClick={() => {
              localStorage.removeItem("creds");
              setUserData(null);
              nav("/");
            }}
          >
            <SignOut size={24} color="black" />
            <p className="whitespace-nowrap">Sign out</p>
          </div>
        </div>
        <hr className="my-4 mb-8 w-full" />
        <TFInput
          cb={(e) => updateEdits(e, "wantsMobile", e.target.checked)}
          value={editedSettings.wantsMobile}
          title="OneShip mobile app"
          description="Do you want to see a OneShip mobile app? We'd like to know!"
        />
        <TextInput
          key={"settingsGrade" + errors.grade}
          cb={(e) => updateEdits(e, "grade", e.target.value)}
          value={editedSettings.grade === -1 ? "" : editedSettings.grade}
          placeholder="Grade"
          title="Your grade (9-12)"
          error={errors.grade}
          description="Used to show you grade-specific announcements and events."
        />
        <TextInput
          key={"settingsCN" + errors.cn}
          error={errors.cn}
          cb={(e) => updateEdits(e, "classNotification", e.target.value)}
          value={editedSettings.classNotification}
          placeholder="Minutes"
          title="Class notifications"
          description="When should we remind you about class? OneShip mobile app only, -1 to disable."
        />
        <TFInput
          cb={(e) => updateEdits(e, "show0", e.target.checked)}
          value={editedSettings.show0}
          title="Show 0 Period"
          description="Show 0 Period on the schedule page?"
        />
        <hr className="my-4 mb-8 w-full" />
        <h1 className="bigText mb-4 w-full text-left">Your Schedule</h1>
        <ScheduleEntryItem
          editedSettings={editedSettings}
          label={"0 Period"}
          onEdit={updateEdits}
        />
        <ScheduleEntryItem
          editedSettings={editedSettings}
          label={"1st Period"}
          onEdit={updateEdits}
        />
        <ScheduleEntryItem
          editedSettings={editedSettings}
          label={"2nd Period"}
          onEdit={updateEdits}
        />
        <ScheduleEntryItem
          editedSettings={editedSettings}
          label={"3rd Period"}
          onEdit={updateEdits}
        />
        <ScheduleEntryItem
          editedSettings={editedSettings}
          label={"4th Period"}
          onEdit={updateEdits}
        />
        <ScheduleEntryItem
          editedSettings={editedSettings}
          label={"5th Period"}
          onEdit={updateEdits}
        />
        <ScheduleEntryItem
          editedSettings={editedSettings}
          label={"6th Period"}
          onEdit={updateEdits}
        />
        <ScheduleEntryItem
          editedSettings={editedSettings}
          label={"7th Period"}
          onEdit={updateEdits}
        />
        <div className="h-36 w-24 shrink-0 md:h-24" />
      </div>
      {changed ? (
        <div className="fixed bottom-12 left-0 h-20 w-full md:bottom-0 md:pl-64">
          <div className="border-grey relative bottom-0 flex h-20 w-full flex-col items-center justify-around border-t bg-white p-4 md:flex-row">
            {!saving ? (
              <>
                <p className="mediumText">You have unsaved changes!</p>
                <button
                  className="bg-theme rounded px-8 py-2 font-bold text-white shadow-lg"
                  onClick={save}
                >
                  Save
                </button>
              </>
            ) : (
              <div className="flex w-full flex-row items-center justify-center gap-4">
                <LoadingSpinner styles={"w-8 h-8"} />
                <p className="mediumText">Saving...</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default SettingsPage;
