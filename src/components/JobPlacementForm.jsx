import { MapPin, QrCode, ScanFace, Tablet } from 'lucide-react';

const fallbackOptions = {
  jobPositions: ['Sales Associate', 'Store Manager', 'Inventory Clerk', 'Cashier'],
  departments: ['Sales', 'Operations', 'Finance', 'Human Resources'],
  branches: ['Ntinda Store', 'Kampala HQ', 'Mukono Warehouse', 'Entebbe Depot'],
  managers: ['David Mugisha', 'Sarah Namatovu', 'John Doe', 'Alice Kigozi'],
  roles: ['Employee', 'Supervisor', 'Manager', 'Admin'],
};

const fields = [
  ['jobPosition', 'Job position', 'jobPositions'],
  ['department', 'Department', 'departments'],
  ['branch', 'Branch', 'branches'],
  ['reportsTo', 'Reports to', 'managers'],
];

const employmentTypes = ['Permanent', 'Contract', 'Casual', 'Intern'];
const clockMethods = [
  ['qr', 'QR code', 'Scan the branch code', QrCode],
  ['gps', 'GPS', 'Inside branch fence', MapPin],
  ['officeDevice', 'Office device', 'Shared tablet', Tablet],
  ['faceCheck', 'Face check', 'Selfie on every clock-in', ScanFace],
];

function Field({ label, children }) {
  return (
    <label className="block text-xs font-semibold text-slate-700">
      <span className="mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

const controlClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-900/10';

export default function JobPlacementForm({ formData, setFormData, options = {} }) {
  const handleChange = (field, value) => setFormData((previous) => ({ ...previous, [field]: value }));
  const handleClockMethodToggle = (method) => {
    setFormData((previous) => ({
      ...previous,
      clockInMethods: {
        ...previous.clockInMethods,
        [method]: !previous.clockInMethods[method],
      },
    }));
  };
  const available = { ...fallbackOptions, ...options };
  const firstName = formData.fullName.split(' ')[0] || 'the employee';

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-bold text-slate-900">Job &amp; placement</h2>
        <p className="mt-1 text-sm text-slate-500">
          Where {firstName} works, who she reports to and how she clocks in.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map(([key, label, optionKey]) => (
          <Field key={key} label={label}>
            <select
              className={controlClass}
              value={formData[key]}
              onChange={(event) => handleChange(key, event.target.value)}
            >
              {(available[optionKey]?.length ? available[optionKey] : fallbackOptions[optionKey]).map(
                (option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                )
              )}
            </select>
          </Field>
        ))}
        <Field label="Start date">
          <input
            className={controlClass}
            type="date"
            value={formData.startDate}
            onChange={(event) => handleChange('startDate', event.target.value)}
          />
        </Field>
        <Field label="App role">
          <select
            className={controlClass}
            value={formData.appRole}
            onChange={(event) => handleChange('appRole', event.target.value)}
          >
            {(available.roles?.length ? available.roles : fallbackOptions.roles).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <fieldset>
        <legend className="mb-2 text-xs font-semibold text-slate-700">Employment type</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {employmentTypes.map((type) => (
            <label
              key={type}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-xs ${
                formData.employmentType === type
                  ? 'border-slate-900 bg-slate-50 font-bold text-slate-900'
                  : 'border-slate-200 text-slate-700 hover:border-slate-400'
              }`}
            >
              <input
                className="accent-slate-900"
                type="radio"
                name="employmentType"
                value={type}
                checked={formData.employmentType === type}
                onChange={() => handleChange('employmentType', type)}
              />
              {type}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-xs font-semibold text-slate-700">Allowed clock-in methods</legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {clockMethods.map(([key, title, description, Icon]) => (
            <label
              key={key}
              className={`flex min-h-20 cursor-pointer items-start gap-2.5 rounded-lg border p-3 transition ${
                formData.clockInMethods[key]
                  ? 'border-slate-700 bg-slate-50'
                  : 'border-slate-200 bg-white hover:border-slate-400'
              }`}
            >
              <input
                className="mt-0.5 accent-slate-900"
                type="checkbox"
                checked={formData.clockInMethods[key]}
                onChange={() => handleClockMethodToggle(key)}
              />
              <span className="min-w-0">
                <span className="mb-1 flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Icon size={14} aria-hidden="true" />
                  {title}
                </span>
                <span className="block text-[11px] leading-snug text-slate-500">{description}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
