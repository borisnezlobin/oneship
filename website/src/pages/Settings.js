import { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../util/contexts";
import { useNavigate } from "react-router-dom";
import TextInput from "../components/settings/TextInput";
import TFInput from "../components/settings/TFInput";
import LoadingSpinner from "../components/LoadingSpinner";
import CONFIG, { ERROR_TOAST_STYLES, SUCCESS_TOAST_STYLES } from "../util/config";
import { toast } from "react-hot-toast";

const SettingsPage = () => {
    const { userData, setUserData } = useContext(UserDataContext);
    const [editedSettings, setEditedSettings] = useState(null);
    const [changed, setChanged] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const nav = useNavigate();

    useEffect(() => {
        if(userData && editedSettings == null){
            setEditedSettings(userData.data);
        }
        // calculate if changed
        if(userData && editedSettings){
            var change = false;
            for(var key in editedSettings){
                if(editedSettings[key] != userData.data[key]){
                    change = true;
                    break;
                }
            }
            if(changed != change) setChanged(change);
        }
    }, [userData, editedSettings]);

    if(!userData || editedSettings == null) return (
        <div className="m-0 md:ml-64 flex flex-col px-4 justify-start pt-4 items-center h-full">
            <p className="bigText text-center">Log in to view your settings</p>
            <hr className="w-full my-4 mb-8" />
            <p className="text-center">
                We need to know who you are to show you your settings.
            </p>
            <div className="h-8" />
            <button className="btn mt-8" onClick={(e) => {
                e.preventDefault();
                nav("/login?continue=/settings");
            }}>
                Log in
            </button>
        </div>
    );

    const updateEdits = (e, key, value) => {
        e.preventDefault();
        var newEdits = {...editedSettings};
        newEdits[key] = value;
        setEditedSettings(newEdits);
    }

    const save = async (e) => {
        e.preventDefault();

        // verify all settings
        if(!checkValid()) return;

        // save
        setSaving(true);
        await fetch(CONFIG.SERVER_URL + "/api/user/settings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                uid: userData.data.uid,
                settings: editedSettings,
                token: userData.token
            })
        }).then(res => {
            // TODO: check for errors
            setUserData({...userData, data: editedSettings});
            toast.success("Saved settings!", SUCCESS_TOAST_STYLES);
        }).catch(err => {
            console.error(err);
            toast.error("Failed to save settings.", ERROR_TOAST_STYLES);
        });
        setSaving(false);
    }

    const checkValid = () => {
        if(editedSettings.grade != -1){
            var grade = parseInt(editedSettings.grade);
            console.log(grade)
            if(isNaN(grade)){
                console.log(editedSettings.grade);
                setErrors({...errors, grade: "Grade must be a valid number."});
                return false;
            }
            if(grade < 9 || grade > 12){
                setErrors({...errors, grade: "Grade must be between 9 and 12."});
                return false;
            }
            setErrors({...errors, grade: ""});
        }

        return true;
    }

    return (
        <>
            <div className="m-0 md:ml-64 flex flex-col px-4 justify-start pt-4 items-center h-full">
                <p className="bigText">Settings for {userData.data.displayName}</p>
                <hr className="w-full my-4 mb-8" />
                <TFInput
                    cb={(e) => updateEdits(e, "wantsMobile", e.target.checked)}
                    value={editedSettings.wantsMobile}
                    title="OneShip mobile app"
                    description="Do you want to see a OneShip mobile app? Help convince the ASB to fund it."
                />
                <TextInput
                    key={"setrtingsgrade" + errors.grade}
                    cb={(e) => updateEdits(e, "grade", e.target.value)}
                    value={editedSettings.grade == -1 ? "" : editedSettings.grade}
                    placeholder="Grade"
                    title="Your grade (9-12)"
                    error={errors.grade}
                    description="Used to show you grade-specific announcements and events."
                />
                <TextInput
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
                <div className="h-12 md:h-20 w-24 shrink-0" />
            </div>
            {changed ?
                <div className="w-full h-20 absolute left-0 bottom-12 md:bottom-0 md:pl-64">
                    <div className="flex flex-col h-20 md:flex-row justify-around items-center border-t border-grey p-4 bg-white relative bottom-0 w-full">
                    {!saving ? <>
                        <p className="mediumText">
                            You have unsaved changes!
                        </p>
                        <button className="bg-theme text-white font-bold shadow-lg rounded px-8 py-2" onClick={save}>
                            Save
                        </button>
                        </>
                        :
                        <div className="w-full flex gap-4 flex-row justify-center items-center">
                            <LoadingSpinner styles={"w-8 h-8"} />
                            <p className="mediumText">
                                Saving...
                            </p>
                        </div>
                    }
                    </div>
                </div>
            : ""}
        </>
    );
};

export default SettingsPage;