const ScheduleEntryItem = ({ editedSettings, label, onEdit }) => {
    const { customName, teacher, room } = editedSettings[label];
    
    return (
        <div className="w-full flex flex-col md:flex-row mt-4 md:mt-0 justify-start items-center mb-2">
            <p className="text-theme text-lg text-left w-full md:w-24">
                {label}
            </p>

            <div className="w-full md:w-1/2 p-0 md:pl-8">
                <input type="text" maxLength={35} className="input" value={customName} onChange={(e) => {
                    onEdit(e, label, {
                        ...editedSettings[label],
                        customName: e.target.value
                    })
                }} />
            </div>
        </div>
    );
};

export default ScheduleEntryItem;