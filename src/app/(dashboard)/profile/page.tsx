'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Save, Edit2, LogOut } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    fetch('/api/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) return;
        setUser(data);
        setFullName(data.fullName || '');
        setEmail(data.email || '');
        setPhone(data.phone || '');
        setLocation(data.location || '');
        setJobTitle(data.jobTitle || '');
        setAvatar(data.avatar || '');
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    const res = await fetch('/api/me', {
      method: 'PUT',
      body: JSON.stringify({ fullName, email, phone, location, jobTitle, avatar }),
    });
    if (res.ok) {
      toast.success('Profile updated successfully');
      window.location.reload();
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <div className="p-8">Loading Profile...</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-12 h-full overflow-y-auto p-6 md:p-8">
      <aside className="w-full lg:w-80 shrink-0 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center">
          <div className="relative mb-6">
            <div className="w-40 h-40 rounded-full border-4 border-slate-50 shadow-md overflow-hidden relative">
              <Image
                src={
                  avatar ||
                  `https://ui-avatars.com/api/?name=${fullName || 'User'}&background=1a3a44&color=fff`
                }
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-1 text-center">{fullName}</h2>
          <p className="text-auth-button font-medium text-sm mb-6">{jobTitle || user?.role}</p>

          <label className="w-full bg-auth-button hover:bg-auth-buttonHover text-white text-sm font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer">
            <Camera size={18} />
            <span>Update Photo</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>

          <div className="w-full space-y-4 pt-6 mt-6 border-t border-slate-100">
            <div>
              <label className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
                Username
              </label>
              <div className="text-slate-600 text-sm font-medium">@{user?.username}</div>
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
                Role
              </label>
              <div className="text-slate-600 text-sm font-medium">{user?.role}</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Profile Information</h3>
          <button
            onClick={handleSave}
            className="px-6 py-2 text-sm font-bold bg-auth-button text-white rounded-lg hover:bg-auth-buttonHover transition-all shadow-sm flex items-center gap-2"
          >
            <Save size={16} /> Save Changes
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h4 className="font-bold text-slate-900">Personal Details</h4>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Full Name</label>
              <div className="relative">
                <input
                  className="w-full px-4 py-2.5 pr-10 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-auth-button/20 focus:border-auth-button text-sm font-medium text-slate-900 bg-white"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Edit2 size={16} />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Work Email</label>
              <div className="relative">
                <input
                  className="w-full px-4 py-2.5 pr-10 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-auth-button/20 focus:border-auth-button text-sm font-medium text-slate-900 bg-white"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Edit2 size={16} />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Work Phone</label>
              <div className="relative">
                <input
                  className="w-full px-4 py-2.5 pr-10 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-auth-button/20 focus:border-auth-button text-sm font-medium text-slate-900 bg-white"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Edit2 size={16} />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Job Title</label>
              <div className="relative">
                <input
                  className="w-full px-4 py-2.5 pr-10 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-auth-button/20 focus:border-auth-button text-sm font-medium text-slate-900 bg-white"
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Logistics Coordinator"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Edit2 size={16} />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Office Location</label>
              <div className="relative">
                <input
                  className="w-full px-4 py-2.5 pr-10 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-auth-button/20 focus:border-auth-button text-sm font-medium text-slate-900 bg-white"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Edit2 size={16} />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 pt-6 mt-6 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-2.5 bg-red-50 text-red-600 rounded-lg font-bold text-sm hover:bg-red-100 transition-colors border border-red-100"
              >
                <LogOut size={18} /> Log Out Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
