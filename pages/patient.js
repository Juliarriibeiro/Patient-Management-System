import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { appointments } from "../data/appointments";

export default function PatientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [billingRecords, setBillingRecords] = useState([]);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    doctorName: "",
    date: "",
    time: "",
    reason: ""
  });
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.role === "patient") {
      setUser(storedUser);
    } else {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        const res = await fetch("https://680dc4fec47cb8074d912473.mockapi.io/medical-records");
        const data = await res.json();
        setMedicalRecords(data);
      } catch (error) {
        console.error("Failed to load medical records:", error);
      }
    };
    fetchMedicalRecords();
  }, []);

  useEffect(() => {
    const fetchBillingRecords = async () => {
      try {
        const res = await fetch("https://680e5962c47cb8074d92d430.mockapi.io/billing-records");
        const data = await res.json();
        setBillingRecords(data);
      } catch (error) {
        console.error("Failed to load billing records:", error);
      }
    };
    fetchBillingRecords();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  const handleScheduleAppointment = () => {
    if (!newAppointment.doctorName || !newAppointment.date || !newAppointment.time || !newAppointment.reason) {
      alert("Please fill out all fields.");
      return;
    }

    const existingAppointments = JSON.parse(localStorage.getItem("patientAppointments")) || [];

    const appointmentToAdd = {
      id: Date.now(),
      patientName: user.name,
      ...newAppointment
    };

    const updatedAppointments = [...existingAppointments, appointmentToAdd];
    localStorage.setItem("patientAppointments", JSON.stringify(updatedAppointments));

    setNewAppointment({ doctorName: "", date: "", time: "", reason: "" });
    setIsScheduleModalOpen(false);

    router.reload();
  };

  const handleCancelAppointment = (id) => {
    const existingAppointments = JSON.parse(localStorage.getItem("patientAppointments")) || [];
    const updatedAppointments = existingAppointments.filter(appt => appt.id !== id);
    localStorage.setItem("patientAppointments", JSON.stringify(updatedAppointments));
    router.reload();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Topbar */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-red-600">PMS+</h1>
        <div className="flex items-center space-x-4">
          <span className="font-semibold">Patient: {user.name}</span>
          <img
            src={user.avatar}
            alt="Patient Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <button
            onClick={handleLogout}
            className="ml-4 bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md p-6">
          <nav className="flex flex-col space-y-6">
            <button onClick={() => setActiveTab("dashboard")} className="text-left text-gray-700 hover:text-red-600 font-semibold">Dashboard</button>
            <button onClick={() => setActiveTab("appointments")} className="text-left text-gray-700 hover:text-red-600 font-semibold">Appointments</button>
            <button onClick={() => setActiveTab("medical-records")} className="text-left text-gray-700 hover:text-red-600 font-semibold">Medical Records</button>
            <button onClick={() => setActiveTab("billing")} className="text-left text-gray-700 hover:text-red-600 font-semibold">Billing</button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === "dashboard" && (
            <>
              <h2 className="text-2xl font-bold mb-6">Welcome, {user.name}!</h2>

              {/* Next Appointment */}
              <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                <h3 className="text-xl font-bold mb-2">Next Appointment</h3>
                {([...JSON.parse(localStorage.getItem("patientAppointments") || "[]"), ...appointments]
                  .filter((appt) => appt.patientName === user.name)
                  .sort((a, b) => new Date(a.date) - new Date(b.date))[0]) ? (
                  <>
                    <p><span className="font-bold">Doctor:</span> {([...JSON.parse(localStorage.getItem("patientAppointments") || "[]"), ...appointments]
                    .filter((appt) => appt.patientName === user.name)
                    .sort((a, b) => new Date(a.date) - new Date(b.date))[0]).doctorName}</p>
                    <p><span className="font-bold">Date:</span> {([...JSON.parse(localStorage.getItem("patientAppointments") || "[]"), ...appointments]
                    .filter((appt) => appt.patientName === user.name)
                    .sort((a, b) => new Date(a.date) - new Date(b.date))[0]).date}</p>
                    <p><span className="font-bold">Time:</span> {([...JSON.parse(localStorage.getItem("patientAppointments") || "[]"), ...appointments]
                    .filter((appt) => appt.patientName === user.name)
                    .sort((a, b) => new Date(a.date) - new Date(b.date))[0]).time}</p>
                  </>
                ) : (
                  <p>No upcoming appointments scheduled.</p>
                )}
              </div>

              {/* Recent Visit Summary */}
              <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                <h3 className="text-xl font-bold mb-2">Recent Visit Summary</h3>
                {medicalRecords.length > 0 ? (
                  <>
                    <p><span className="font-bold">Diagnosis:</span> {medicalRecords[0].diagnosis}</p>
                    <p><span className="font-bold">Medications:</span> {medicalRecords[0].medications}</p>
                    <p><span className="font-bold">Last Visit:</span> {medicalRecords[0].lastVisit}</p>
                  </>
                ) : (
                  <p>No medical history available.</p>
                )}
              </div>

              {/* Health Tip */}
              <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                <h3 className="text-xl font-bold mb-2">Health Tip of the Day</h3>
                <p className="text-gray-700">💧 Remember to stay hydrated! Aim for 8 glasses of water daily.</p>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveTab('appointments')}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl shadow-md hover:bg-red-600"
                >
                  View Appointments
                </button>
                <button
                  onClick={() => setActiveTab('billing')}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl shadow-md hover:bg-red-600"
                >
                  View Billing
                </button>
              </div>
            </>
          )}

          {activeTab === "appointments" && (
            <>
              <h2 className="text-2xl font-bold mb-4">My Appointments</h2>
              <button
                onClick={() => setIsScheduleModalOpen(true)}
                className="mb-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Schedule New Appointment
              </button>
              <div className="grid grid-cols-1 gap-4">
                {[...(JSON.parse(localStorage.getItem("patientAppointments")) || []), ...appointments]
                  .filter((appt) => appt.patientName === user.name)
                  .map((appt) => (
                    <div key={appt.id} className="bg-white rounded-xl shadow p-4 relative">
                      <p><span className="font-bold">Doctor:</span> {appt.doctorName}</p>
                      <p><span className="font-bold">Date:</span> {appt.date}</p>
                      <p><span className="font-bold">Time:</span> {appt.time}</p>
                      <p><span className="font-bold">Reason:</span> {appt.reason}</p>

                      {appt.id && (
                        <button
                          onClick={() => handleCancelAppointment(appt.id)}
                          className="absolute top-4 right-4 bg-red-500 text-white text-sm px-2 py-1 rounded-md hover:bg-red-600"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            </>
          )}

          {activeTab === "medical-records" && (
            <>
              <h2 className="text-2xl font-bold mb-4">My Medical Records</h2>
              <div className="grid grid-cols-1 gap-4">
                {medicalRecords
                  .filter((record) => record.patientName === user.name)
                  .map((record) => (
                    <div
                      key={record.id}
                      onClick={() => { setSelectedRecord(record); setIsRecordModalOpen(true); }}
                      className="bg-white p-4 rounded-xl shadow hover:scale-105 transition cursor-pointer"
                    >
                      <p><span className="font-bold">Diagnosis:</span> {record.diagnosis}</p>
                      <p><span className="font-bold">Last Visit:</span> {record.lastVisit}</p>
                    </div>
                  ))}
              </div>
            </>
          )}

          {activeTab === "billing" && (
            <>
              <h2 className="text-2xl font-bold mb-4">Billing</h2>
              <div className="grid grid-cols-1 gap-4">
                {billingRecords.filter((record) => record.patientName === user.name).map((record) => (
                  <div key={record.id} className="bg-white rounded-xl shadow p-4">
                    <p><span className="font-bold">Date:</span> {record.date}</p>
                    <p><span className="font-bold">Description:</span> {record.description}</p>
                    <p><span className="font-bold">Amount:</span> ${record.amount}</p>
                    <p>
                      <span className="font-bold">Status:</span>{" "}
                      <span className={record.status === "Paid" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                        {record.status}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Record Modal */}
      {isRecordModalOpen && selectedRecord && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-xl shadow-lg w-96 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Medical Record Details</h2>
      <p><span className="font-bold">Diagnosis:</span> {selectedRecord.diagnosis}</p>
      <p><span className="font-bold">Medications:</span> {selectedRecord.medications}</p>
      <p><span className="font-bold">Last Visit:</span> {selectedRecord.lastVisit}</p>
      <p><span className="font-bold">Doctor's Notes:</span> Follow-up recommended in 6 months.</p>

      <button
        onClick={() => setIsRecordModalOpen(false)}
        className="mt-6 w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
      >
        Close
      </button>
    </div>
  </div>
)}
      {/* Schedule Appointment Modal */}
{isScheduleModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-xl shadow-lg w-96">
      <h2 className="text-2xl font-bold mb-4">Schedule New Appointment</h2>
      <div className="space-y-4">
      <select
    value={newAppointment.doctorName}
    onChange={(e) => setNewAppointment({ ...newAppointment, doctorName: e.target.value })}
    className="w-full p-2 border rounded-md"
  >
    <option value="">Select Doctor</option>
    <option value="Jason Held">Dr. Jason Held</option>
    <option value="Vincent Chen">Dr. Vincent Chen</option>
    <option value="Austin Shum">Dr. Austin Shum</option>
    <option value="Manan Gosalia">Dr. Manan Gosalia</option>
    <option value="Yuhao Gao">Dr. Yuhao Gao</option>
  </select>
        <input
          type="date"
          value={newAppointment.date}
          onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
          className="w-full p-2 border rounded-md"
        />
        <input
          type="time"
          value={newAppointment.time}
          onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
          className="w-full p-2 border rounded-md"
        />
        <input
          type="text"
          placeholder="Reason for Visit"
          value={newAppointment.reason}
          onChange={(e) => setNewAppointment({ ...newAppointment, reason: e.target.value })}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={() => setIsScheduleModalOpen(false)}
          className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
        >
          Cancel
        </button>
        <button
          onClick={handleScheduleAppointment}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
