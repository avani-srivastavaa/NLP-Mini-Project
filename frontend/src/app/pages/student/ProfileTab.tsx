import { User, Mail, GraduationCap, Phone, Hash, BookOpen, CheckCircle, Lock } from 'lucide-react';
import { Button } from '../../components/ui/button';

const studentProfile = {
  name: 'Dhiru bhai Ambani',
  admissionNo: 'ADM-2024-0012',
  email: 'ambanidhiru@mes.ac.in',
  department: 'Computer Science',
  class: 'B.Sc. CS – Year 2',
  contactNumber: '+91 9912939482',
};

const profileCompletion = 100; // Mock

export default function ProfileTab() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 delay-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Student Profile</h1>
        <Button className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-lg shadow-amber-100 px-6 py-2.5 font-bold transition-all hover:-translate-y-0.5">
          Edit Portfolio
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-amber-600 rounded-full flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                <User className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 border-4 border-white rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">{studentProfile.name}</h2>
            <p className="text-sm font-semibold text-amber-600 uppercase tracking-widest mb-6">{studentProfile.department}</p>
            
            <div className="flex flex-col gap-3 w-full border-t border-gray-50 pt-6">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-left">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Admission ID</p>
                <p className="text-sm font-bold text-gray-800">{studentProfile.admissionNo}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-3xl p-6 shadow-xl text-white">
            <div className="flex items-center justify-between mb-4">
               <p className="text-sm font-bold tracking-tight opacity-70">Profile Trust Score</p>
               <span className="text-xl font-black text-amber-400">{profileCompletion}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: '100%' }} />
            </div>
            <p className="text-xs font-medium text-white/60 leading-relaxed">
              Your profile is verified. You have full access to library borrowing.
            </p>
          </div>
        </div>

        {/* Right Column: Detailed Info Grid */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-full">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">Personal Information</h3>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <ProfileField icon={<User />} label="Full Name" value={studentProfile.name} />
              <ProfileField icon={<Hash />} label="AdmissionID" value={studentProfile.admissionNo} />
              <ProfileField icon={<Mail />} label="Email Address" value={studentProfile.email} />
              <ProfileField icon={<BookOpen />} label="Faculty" value={studentProfile.department} />
              <ProfileField icon={<GraduationCap />} label="Academic Tier" value={studentProfile.class} />
              <ProfileField icon={<Phone />} label="Verified Contact" value={studentProfile.contactNumber} />
            </div>
            
            <div className="mt-12 p-6 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-4">
               <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5" />
               </div>
               <div className="min-w-0">
                  <p className="text-sm font-bold text-amber-900 leading-tight mb-1">Information Security</p>
                  <p className="text-xs text-amber-700/70 font-medium line-clamp-2">Only senior librarians can modify these fields. Contact admin for updates.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="group relative">
      <div className="flex items-start gap-4 p-4 rounded-2xl transition-all hover:bg-gray-50 border border-transparent hover:border-gray-100">
        <div className="w-10 h-10 bg-gray-50 group-hover:bg-amber-100 text-gray-400 group-hover:text-amber-600 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold text-gray-400 group-hover:text-amber-600 uppercase tracking-widest mb-1 transition-colors">{label}</p>
          <p className="text-sm font-bold text-gray-800 truncate">{value}</p>
        </div>
      </div>
    </div>
  );
}
