import { useState } from "react";
import { Search, Sparkles, Send, User, CheckCircle2 } from "lucide-react";
import { mockPortalData } from "../../../../data/mockPortalData";
import { cn } from "../../../../lib/utils";

const questions = mockPortalData.instructor.questions;

export default function QAManagement() {
  const [activeQuestion, setActiveQuestion] = useState<string | null>(questions.length > 0 ? questions[0].id : null);
  const [replyText, setReplyText] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const selectedQ = activeQuestion ? questions.find(q => q.id === activeQuestion) : null;

  const handleAiDraft = () => {
    if (!selectedQ) return;
    setIsAiGenerating(true);
    setReplyText("");
    
    // Simulate typing effect
    let i = 0;
    const draft = selectedQ.aiDraft;
    const interval = setInterval(() => {
      setReplyText(draft.slice(0, i));
      i+=3;
      if (i > draft.length) {
        clearInterval(interval);
        setReplyText(draft);
        setIsAiGenerating(false);
      }
    }, 20);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6 animate-in fade-in duration-700">
      {/* Left Sidebar list */}
      <div className="w-80 flex flex-col rounded-2xl border border-white/10 bg-[#0B1524]/80 backdrop-blur-xl">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-lg font-bold text-white mb-4">Hỏi Đáp</h2>
          <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-slate-300">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Tìm theo từ khóa..." 
              className="bg-transparent border-0 outline-none w-full text-sm"
            />
          </div>
          <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
            <button className="whitespace-nowrap px-3 py-1.5 rounded-full bg-cyan-500/20 text-cyan-400">Chưa Đọc (12)</button>
            <button className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 text-slate-400 hover:text-white">Đã phản hồi</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-1">
          {questions.map((q) => (
            <button
              key={q.id}
              onClick={() => {
                setActiveQuestion(q.id);
                setReplyText("");
              }}
              className={cn(
                "w-full text-left rounded-xl p-4 transition-all",
                activeQuestion === q.id ? "bg-cyan-500/10 border border-cyan-500/30" : "hover:bg-white/5 border border-transparent"
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-bold text-slate-200">{q.studentName}</span>
                <span className="text-[10px] text-slate-500">{q.time}</span>
              </div>
              <p className="text-xs text-cyan-400 mb-1">{q.lesson}</p>
              <p className="text-xs text-slate-400 line-clamp-2">{q.question}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      {selectedQ ? (
        <div className="flex-1 flex flex-col rounded-2xl border border-white/10 bg-[#0B1524]/80 backdrop-blur-xl shrink-0 min-w-0">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-white/10">
            <div>
              <h2 className="text-xl font-bold text-white">{selectedQ.course}</h2>
              <p className="text-sm text-cyan-400 mt-1">Bài học: {selectedQ.lesson}</p>
            </div>
            <button className="flex items-center gap-2 rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 size={14} /> Resolves
            </button>
          </div>

          {/* Conversation */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <div className="flex gap-4">
              <div className="h-10 w-10 shrink-0 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <User size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-slate-200">{selectedQ.studentName}</span>
                  <span className="text-xs text-slate-500">{selectedQ.time}</span>
                </div>
                <div className="rounded-2xl rounded-tl-none bg-white/5 border border-white/5 p-4 text-sm text-slate-300 leading-relaxed max-w-2xl">
                  {selectedQ.question}
                </div>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-white/10 bg-white/[0.02]">
            <div className="flex gap-3 mb-4">
              <button 
                onClick={handleAiDraft}
                disabled={isAiGenerating}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-cyan-500/30 px-4 py-2 text-xs font-bold text-cyan-300 transition hover:bg-cyan-500/20 disabled:opacity-50"
              >
                <Sparkles size={14} className={cn(isAiGenerating && "animate-spin")} />
                {isAiGenerating ? "AI is typing..." : "Auto AI Draft"}
              </button>
            </div>
            
            <div className="relative">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Viết câu trả lời của bạn..."
                className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-4 pr-16 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-500/50 min-h-[120px] resize-none"
              />
              <button className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 text-slate-900 transition hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Send size={18} className="translate-x-0.5 -translate-y-0.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center rounded-2xl border border-white/10 bg-[#0B1524]/80 backdrop-blur-xl">
           <p className="text-slate-500">Chọn một tin nhắn để bắt đầu</p>
        </div>
      )}
    </div>
  );
}
