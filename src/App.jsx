import React, { useState } from 'react';
import { 
  Download, Instagram, Youtube, Music, LogOut, 
  Smartphone, CheckCircle2, AlertCircle, Loader2, Globe, Link2, Copy, Zap, Info, ShieldCheck, X, HelpCircle
} from 'lucide-react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('tiktok');
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showGuide, setShowGuide] = useState(false);

  const platforms = [
    { id: 'tiktok', name: 'TikTok', icon: <Music className="w-5 h-5" />, color: 'bg-zinc-900' },
    { id: 'instagram', name: 'Instagram', icon: <Instagram className="w-5 h-5" />, color: 'bg-gradient-to-tr from-orange-500 via-pink-500 to-purple-600' },
    { id: 'youtube', name: 'YouTube', icon: <Youtube className="w-5 h-5" />, color: 'bg-red-600' },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => { setIsLoggedIn(true); setIsLoading(false); }, 800);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setMessage({ type: 'success', text: 'Link ditempel!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 2000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Gunakan tempel manual bos' });
    }
  };

  const startDownload = async (e) => {
    e.preventDefault();
    if (!url) { setMessage({ type: 'error', text: 'Isi link dulu!' }); return; }
    setIsLoading(true); setMessage({ type: '', text: '' });

    try {
      let downloadUrl = "";
      if (activeTab === 'tiktok') {
        const res = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
        const data = await res.json();
        downloadUrl = data.data?.play;
      } else if (activeTab === 'instagram') {
        const res = await fetch(`https://api.vkrdown.com/instagram/?url=${encodeURIComponent(url)}`);
        const data = await res.json();
        downloadUrl = data.data?.url || data.url;
      } else {
        const res = await fetch(`https://api.vkrdown.com/server/?url=${encodeURIComponent(url)}`);
        const data = await res.json();
        downloadUrl = data.data?.url || data.url;
      }

      if (downloadUrl) {
        window.open(downloadUrl, '_blank');
        setMessage({ type: 'success', text: 'Berhasil! Mengunduh...' });
      } else { throw new Error(); }
    } catch (error) {
      setMessage({ type: 'info', text: 'Server sibuk, mengalihkan...' });
      setTimeout(() => {
        let redirectUrl = activeTab === 'tiktok' ? `https://snaptik.app` : activeTab === 'instagram' ? `https://saveig.app` : `https://y2mate.com`;
        window.open(redirectUrl, '_blank');
      }, 1500);
    } finally { setIsLoading(false); }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="bg-white/5 backdrop-blur-lg p-10 rounded-[3rem] border border-white/10 shadow-2xl text-center">
            <div className="w-24 h-24 bg-indigo-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 rotate-6 text-white"><Download size={48} strokeWidth={3} /></div>
            <h2 className="text-4xl font-black text-white tracking-tighter mb-1 italic">V-PRO</h2>
            <p className="text-indigo-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-10">Developed by Pai Leonore</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="text" placeholder="Username" className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 text-white outline-none text-sm" />
              <input type="password" placeholder="Password" className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 text-white outline-none text-sm" />
              <button className="w-full py-5 bg-indigo-600 rounded-[2rem] text-white font-black text-xl uppercase">Masuk</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-40">
      <div className={`pt-16 pb-12 px-8 rounded-b-[4rem] shadow-2xl text-white transition-all duration-700 ${platforms.find(p => p.id === activeTab).color}`}>
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/30"><Zap size={24} fill="currentColor" /></div>
            <div><span className="font-black text-2xl tracking-tighter block leading-none">V-PRO</span><span className="text-[9px] font-bold opacity-80 uppercase italic">By Pai Leonore</span></div>
          </div>
          <button onClick={() => setIsLoggedIn(false)} className="bg-black/20 p-3 rounded-2xl"><LogOut size={22} /></button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {platforms.map(p => (
            <button key={p.id} onClick={() => setActiveTab(p.id)} className={`flex flex-col items-center gap-3 py-6 rounded-[2.5rem] border-2 ${activeTab === p.id ? 'bg-white text-slate-900 border-white' : 'bg-white/10 border-white/10 text-white'}`}>
              {p.icon}<span className="text-[9px] font-black uppercase">{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 -mt-10">
        <div className="bg-white p-8 rounded-[3.5rem] shadow-2xl border border-slate-50">
          <div className="flex justify-between items-center mb-5 px-2">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Link2 size={16} /> Link {activeTab}</h3>
            <button onClick={handlePaste} className="text-[10px] font-black bg-indigo-50 px-4 py-2 rounded-full text-indigo-600 uppercase">Tempel</button>
          </div>
          <form onSubmit={startDownload} className="space-y-6">
            <textarea value={url} onChange={(e) => setUrl(e.target.value)} className="w-full p-7 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 outline-none text-sm font-bold" placeholder={`Paste link ${activeTab}...`} rows="3" />
            {message.text && (
              <div className={`p-5 rounded-[2rem] flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                <Icon name={message.type === 'success' ? 'check-circle-2' : 'info'} size={20} />
                <span className="text-[11px] font-black uppercase tracking-tight">{message.text}</span>
              </div>
            )}
            <button disabled={isLoading} className="w-full py-7 rounded-[3rem] bg-slate-900 text-white font-black text-xl flex items-center justify-center gap-4 active:scale-95 transition-all">
              {isLoading ? <Loader2 className="animate-spin" size={28} /> : <><Download size={26} strokeWidth={4} /> UNDUH</>}
            </button>
          </form>
        </div>
      </div>

      <div className="px-8 mt-12">
        <div className="bg-indigo-600 rounded-[3rem] p-8 text-white shadow-2xl flex items-center gap-5">
          <div className="bg-white/20 p-4 rounded-3xl"><ShieldCheck size={30} /></div>
          <div><p className="font-black text-xl italic uppercase">V-PRO SECURE</p><p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mt-2">Verified by Pai Leonore</p></div>
        </div>
      </div>

      {showGuide && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-8">
          <div className="bg-white w-full max-w-sm rounded-[3.5rem] p-10 relative text-center">
            <button onClick={() => setShowGuide(false)} className="absolute top-8 right-8 text-slate-300"><X size={28} /></button>
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6"><HelpCircle size={44} /></div>
            <h4 className="text-2xl font-black mb-2 uppercase italic">Panduan</h4>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest px-4">Salin link, tempel di kotak, tekan unduh.</p>
            <button onClick={() => setShowGuide(false)} className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase">Siap!</button>
          </div>
        </div>
      )}

      <div className="fixed bottom-10 left-10 right-10 h-22 bg-white/90 backdrop-blur-3xl border border-white rounded-[3rem] shadow-2xl flex justify-around items-center px-8 z-40">
        <button onClick={() => setShowGuide(false)} className={`p-3 rounded-2xl ${!showGuide ? 'text-indigo-600 bg-indigo-50' : 'text-slate-300'}`}><Globe size={26} /></button>
        <button className="text-slate-300 opacity-20"><Smartphone size={26} /></button>
        <button onClick={() => setShowGuide(true)} className={`p-3 rounded-2xl ${showGuide ? 'text-indigo-600 bg-indigo-50' : 'text-slate-300'}`}><Link2 size={26} /></button>
      </div>
    </div>
  );
}

const Icon = ({ name, size = 24 }) => {
    return <i data-lucide={name} style={{ width: size, height: size }}></i>;
};


