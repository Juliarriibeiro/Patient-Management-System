import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { appointments } from "../data/appointments";
import { users } from "../data/users";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function DoctorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [selectedReceiver, setSelectedReceiver] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboardView, setDashboardView] = useState("main");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState({ receiver: "", text: "" });
  const [receiver, setReceiver] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.role === "doctor") {
      setUser(storedUser);
    } else {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      if (activeTab === "messages") {
        try {
          const res = await fetch("https://680dc4fec47cb8074d912473.mockapi.io/conversations");
          const data = await res.json();
          setMessages(data);
        } catch (error) {
          console.error("Failed to load conversations:", error);
        }
      }
    };
    fetchConversations();
  }, [activeTab]);
  

  const sendMessage = async () => {
    if (!newMessage.text.trim() || !newMessage.receiver) return;
  
    try {
      const res = await fetch("https://680dc4fec47cb8074d912473.mockapi.io/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: user.name,
          receiver: newMessage.receiver,
          text: newMessage.text,
          timestamp: new Date().toLocaleString()
        }),
      });
  
      if (res.ok) {
        const newMsg = await res.json();
        setMessages((prev) => [...prev, newMsg]);
        setNewMessage("");
        setSelectedReceiver(""); // Optional: reset dropdown
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };  

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Topbar */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-red-600">PMS+</h1>
        <div className="flex items-center space-x-4">
          <span className="font-semibold">Dr. {user.name}</span>
          <img src={user.avatar} alt="Doctor Avatar" className="w-10 h-10 rounded-full object-cover" />
          <button onClick={handleLogout} className="ml-4 bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600">
            Logout
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md p-6">
          <nav className="flex flex-col space-y-6">
            <button onClick={() => { setActiveTab("dashboard"); setDashboardView("main"); }} className="text-gray-700 hover:text-red-600 font-semibold text-left">
              Dashboard
            </button>
            <button onClick={() => setActiveTab("patients")} className="text-gray-700 hover:text-red-600 font-semibold text-left">
              Patients
            </button>
            <button onClick={() => setActiveTab("appointments")} className="text-gray-700 hover:text-red-600 font-semibold text-left">
              Appointments
            </button>
            <button onClick={() => setActiveTab("messages")} className="text-gray-700 hover:text-red-600 font-semibold text-left">
              Messages
            </button>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6">

          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <>
              {dashboardView === "main" && (
                <>
                  <h2 className="text-2xl font-bold mb-6">Welcome Dr. {user.name}!</h2>
                  {/* Top Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {/* Patient Rounds */}
                    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold mb-2">Patient Rounds</h3>
                        <p className="text-gray-600">Review scheduled patient rounds.</p>
                      </div>
                      <button
                        onClick={() => setDashboardView("rounds")}
                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                      >
                        View Details
                      </button>
                    </div>

                   {/* Patient Types (Bar Chart) */}
<div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between">
  <h3 className="text-lg font-bold mb-4">Patient Types</h3>
  <ResponsiveContainer width="100%" height={250}>
  <BarChart
    data={[
      { category: "Patients", newPatients: 120, returningPatients: 80 }
    ]}
    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="category" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="newPatients" fill="#60A5FA" name="New Patients" />
    <Bar dataKey="returningPatients" fill="#34D399" name="Returning Patients" />
  </BarChart>
</ResponsiveContainer>
</div>


                    {/* Lab Test Results */}
                    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold mb-2">Lab Test Results</h3>
                        <p className="text-gray-600">Check recent lab results and updates.</p>
                      </div>
                      <button
                        onClick={() => setDashboardView("labs")}
                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                      >
                        Review Results
                      </button>
                    </div>
                  </div>

                  {/* Middle Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {/* Daily Read */}
                    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold mb-4">Daily Read</h3>
                        <p className="text-gray-600 mb-6">
                          New warning on outpatient delays by NHS data.
                        </p>
                      </div>
                      <a
                        href="https://www.rcp.ac.uk/news-and-media/news-and-opinion/rcp-responds-to-nhs-data-with-warning-on-outpatient-delays/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 block text-center bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
                      >
                        Read More
                      </a>
                    </div>

                    {/* Updates */}
                    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold mb-2">Updates</h3>
                        <p className="text-gray-600 mb-6">
                          Monthly doctor's meet scheduled.
                        </p>
                      </div>
                      <button
                        onClick={() => setDashboardView("updates")}
                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                      >
                        View All
                      </button>
                    </div>

                    {/* Statistics */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                      <h3 className="text-lg font-bold mb-4">Statistics (Last 6 Months)</h3>
                      <ResponsiveContainer width="100%" height={200}>
      <LineChart data={[
        { month: "Dec", Appointments: 70, Walkins: 25 },
        { month: "Jan", Appointments: 50, Walkins: 30 },
        { month: "Feb", Appointments: 80, Walkins: 20 },
        { month: "Mar", Appointments: 60, Walkins: 28 },
        { month: "Apr", Appointments: 75, Walkins: 35 },
        { month: "May", Appointments: 65, Walkins: 22 }
      ]}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Appointments" stroke="black" strokeWidth={2} />
        <Line type="monotone" dataKey="Walkins" stroke="red" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>

  <hr className="my-6" />

</div>

                  {/* Appointments Section */}
                  <section className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Upcoming Appointments</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {appointments
                        .filter((appt) => appt.doctorName === user.name)
                        .map((appt) => (
                          <div
                            key={appt.id}
                            className="bg-white rounded-xl shadow-md p-4 transform transition-transform hover:scale-105 hover:shadow-lg"
                          >
                            <p><span className="font-bold">Patient:</span> {appt.patientName}</p>
                            <p><span className="font-bold">Date:</span> {appt.date}</p>
                            <p><span className="font-bold">Time:</span> {appt.time}</p>
                            <p><span className="font-bold">Reason:</span> {appt.reason}</p>
                          </div>
                        ))}
                    </div>
                  </section>
                </>
              )}

              {/* Patient Rounds View */}
              {dashboardView === "rounds" && (
                <>
                  <h2 className="text-2xl font-bold mb-4">Today's Patient Rounds</h2>
                  <ul className="space-y-4">
                    <li className="bg-white p-4 rounded-xl shadow">John Smith - 9:00 AM - Room 201</li>
                    <li className="bg-white p-4 rounded-xl shadow">Lisa Johnson - 10:30 AM - Room 304</li>
                    <li className="bg-white p-4 rounded-xl shadow">Mike Brown - 1:00 PM - Room 115</li>
                  </ul>
                  <button
                    onClick={() => setDashboardView("main")}
                    className="mt-6 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  >
                    Back to Dashboard
                  </button>
                </>
              )}

              {/* Lab Results View */}
              {dashboardView === "labs" && (
                <>
                  <h2 className="text-2xl font-bold mb-4">Lab Test Results</h2>
                  <ul className="space-y-4">
                    <li className="bg-white p-4 rounded-xl shadow">Blood Test - Normal</li>
                    <li className="bg-white p-4 rounded-xl shadow">MRI - Pending Review</li>
                  </ul>
                  <button
                    onClick={() => setDashboardView("main")}
                    className="mt-6 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  >
                    Back to Dashboard
                  </button>
                </>
              )}

              {/* Updates View */}
              {dashboardView === "updates" && (
                <>
                  <h2 className="text-2xl font-bold mb-4">Hospital Updates</h2>
                  <div className="bg-white p-6 rounded-xl shadow space-y-4">
                    <p><span className="font-bold">Monthly Doctor's Meet:</span> May 30th, 4:00 PM, Conference Room A</p>
                    <p><span className="font-bold">Policy Update:</span> Mandatory record audits every quarter.</p>
                  </div>
                  <button
                    onClick={() => setDashboardView("main")}
                    className="mt-6 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  >
                    Back to Dashboard
                  </button>
                </>
              )}
            </>
          )}

          {/* Patients */}
          {activeTab === "patients" && (
            <>
              <h2 className="text-2xl font-bold mb-4">Your Patients</h2>
              <div className="grid grid-cols-1 gap-4">
                {users.filter((u) => u.role === "patient").map((patient) => (
                  <div key={patient.id} onClick={() => { setSelectedPatient(patient); setIsModalOpen(true); }} className="bg-white p-4 rounded-xl shadow hover:scale-105 transition cursor-pointer">
                    <p><span className="font-bold">Name:</span> {patient.name}</p>
                    <p><span className="font-bold">Email:</span> {patient.email}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Appointments */}
          {activeTab === "appointments" && (
            <>
              <h2 className="text-2xl font-bold mb-4">Upcoming Appointments</h2>
              <div className="grid grid-cols-1 gap-4">
              {[...appointments, ...(JSON.parse(localStorage.getItem("patientAppointments")) || [])]
                .filter((appt) => appt.doctorName === user.name)
                .map((appt) => (
                    <div key={appt.id} className="bg-white p-4 rounded-xl shadow hover:scale-105 transition">
                      <p><span className="font-bold">Patient:</span> {appt.patientName}</p>
                      <p><span className="font-bold">Date:</span> {appt.date}</p>
                      <p><span className="font-bold">Time:</span> {appt.time}</p>
                      <p><span className="font-bold">Reason:</span> {appt.reason}</p>
                    </div>
                  ))}
              </div>
            </>
          )}

          {/* Messages */}
          {activeTab === "messages" && (
  <>
    <h2 className="text-2xl font-bold mb-4">Conversations</h2>

    {/* Conversation List */}
    <div className="space-y-4 mb-6">
      {messages.map((msg) => (
        <div key={msg.id} className="bg-white p-4 rounded-xl shadow">
          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold">{msg.sender} ➔ {msg.receiver}</p>
            <p className="text-sm text-gray-500">{new Date(msg.timestamp).toLocaleString()}</p>
          </div>
          <p>{msg.text}</p>
        </div>
      ))}
    </div>

    {/* Send New Message */}
    <div className="bg-white p-6 rounded-xl shadow space-y-4">
      <select
        value={newMessage.receiver}
        onChange={(e) => setNewMessage({ ...newMessage, receiver: e.target.value })}
        className="w-full p-2 border rounded-md"
      >
        <option value="">Select Receiver</option>
        <option value="Dr. Jason Held">Dr. Jason Held</option>
        <option value="Dr. Vincent Chen">Dr. Vincent Chen</option>
        <option value="Nurse Emily">Nurse Emily</option>
        <option value="Admin Sara">Admin Sara</option>
      </select>

      <input
        type="text"
        placeholder="Type your message..."
        value={newMessage.text}
        onChange={(e) => setNewMessage({ ...newMessage, text: e.target.value })}
        className="w-full p-2 border rounded-md"
      />

<button
  onClick={sendMessage}
  disabled={!newMessage.receiver || !newMessage.text.trim()}
  className={`bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 w-full ${
    (!newMessage.receiver || !newMessage.text.trim()) && "opacity-50 cursor-not-allowed"
  }`}
>
  Send
</button>

    </div>
  </>
)}


        </main>
      </div>

      {/* Patient Modal */}
      {isModalOpen && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Patient Details</h2>
            <p><span className="font-bold">Name:</span> {selectedPatient.name}</p>
            <p><span className="font-bold">Email:</span> {selectedPatient.email}</p>
            <p><span className="font-bold">Medical History:</span> No major issues.</p>
            <button onClick={() => setIsModalOpen(false)} className="mt-6 w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600">
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
