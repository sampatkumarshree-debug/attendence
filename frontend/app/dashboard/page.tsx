"use client";

import { useRouter } from "next/navigation";
import { Users, Camera, BarChart3 } from "lucide-react";

const tools = [
  {
    title: "Register Student",
    description: "Add a new student with 5 face photos for accurate recognition.",
    icon: <Users className="w-8 h-8" />,
    path: "/student/registrationform",
    color: "from-blue-500 to-blue-600",
    border: "border-blue-200 hover:border-blue-400",
  },
  {
    title: "Take Attendance",
    description: "Start a live camera session to automatically mark attendance using face recognition.",
    icon: <Camera className="w-8 h-8" />,
    path: "/teacher/start-session",
    color: "from-emerald-500 to-emerald-600",
    border: "border-emerald-200 hover:border-emerald-400",
  },
  {
    title: "View Attendance Records",
    description: "Search and export attendance logs filtered by date, department, or subject.",
    icon: <BarChart3 className="w-8 h-8" />,
    path: "/student/view-attendance",
    color: "from-purple-500 to-purple-600",
    border: "border-purple-200 hover:border-purple-400",
  },
];

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <Camera className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              AI Attendance System
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Face Recognition Attendance
            </p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-14">
        {/* Intro */}
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
            AI / Deep Learning
          </span>
          <h2 className="text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">
            Face Recognition Attendance
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            Automated attendance marking using real-time facial recognition with DeepFace and MTCNN.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, i) => (
            <div
              key={i}
              onClick={() => router.push(tool.path)}
              className={`group relative bg-white rounded-2xl border-2 ${tool.border} p-7 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
            >
              {/* Subtle Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`} />

              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${tool.color} text-white shadow-lg mb-5 group-hover:scale-110 transition-transform duration-300`}>
                {tool.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{tool.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-5">{tool.description}</p>
              <div className={`inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${tool.color} text-white px-4 py-2 rounded-xl shadow group-hover:shadow-md group-hover:gap-3 transition-all duration-300`}>
                Open
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Tech Badge Row */}
        <div className="mt-14 flex flex-wrap justify-center gap-3 text-sm">
          {["DeepFace", "MTCNN", "FaceNet512", "Flask", "Next.js", "MongoDB"].map((tech) => (
            <span key={tech} className="px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-medium">
              {tech}
            </span>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-slate-400 text-sm">
        AI Mini Project &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}