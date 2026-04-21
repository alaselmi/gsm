export default function Settings() {
  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">

        <div>
          <p className="text-gray-500 text-sm">Account</p>
          <p className="font-medium">Admin User</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Email</p>
          <p className="font-medium">admin@gsm.com</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Role</p>
          <p className="font-medium">Admin</p>
        </div>

      </div>

    </div>
  );
}