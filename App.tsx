
import React, { useState } from 'react';
import { LeadData } from './types';
import { sendLeadToWebhook } from './services/webhookService';
import {
  Building2,
  User,
  Mail,
  Phone,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Rocket,
  MessageSquare,
  Clock,
  ShieldAlert,
  BrainCircuit,
  Zap,
  TrendingUp,
  AlertTriangle,
  SmilePlus,
  HelpCircle
} from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [quizData, setQuizData] = useState({
    name: '',
    hasCompany: '', // Sim, Não, Autônomo
    companyName: '',
    revenue: 5000,
    attendant: '', // eu, secretaria, equipe
    ifMisses: '', // tudo para, sobra pra mim
    trainingTime: '', // dias, semanas
    nightPainAgreed: '', // sim, nao
  });

  const [formData, setFormData] = useState<LeadData>({
    id: crypto.randomUUID(),
    name: '',
    email: '',
    phone: '',
    company: '',
    city: 'Não informada',
    state: 'BR',
    country: 'Brasil',
    source: 'quiz_botconversa_2026',
    notes: '',
    revenue: 5000,
    created_at: new Date().toISOString()
  });

  const updateQuiz = (key: string, value: any) => {
    setQuizData(prev => ({ ...prev, [key]: value }));
    if (key === 'name') setFormData(f => ({ ...f, name: value }));
    if (key === 'companyName') setFormData(f => ({ ...f, company: value }));
    if (key === 'revenue') setFormData(f => ({ ...f, revenue: value }));
  };

  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => Math.max(0, s - 1));

  const formatPhoneNumber = (phone: string) => {
    let cleaned = phone.replace(/\D/g, '');
    if (!cleaned) return '';
    if (cleaned.length >= 10 && cleaned.length <= 11 && !cleaned.startsWith('55')) {
      cleaned = '55' + cleaned;
    }
    return cleaned;
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.phone) {
      setError('Preencha seu e-mail e WhatsApp para continuarmos.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const notesSummary = `
      Fluxo Quiz 2026:
      - Empresa: ${quizData.hasCompany} (${quizData.companyName || 'N/A'})
      - Faturamento: R$ ${quizData.revenue}
      - Atendimento: ${quizData.attendant}
      - Riscos: ${quizData.ifMisses || 'N/A'}
      - Treinamento: ${quizData.trainingTime || 'N/A'}
      - Concordou com dor 24/7: ${quizData.nightPainAgreed}
    `.trim();

    const submissionData = {
      ...formData,
      phone: formatPhoneNumber(formData.phone),
      notes: notesSummary
    };

    const success = await sendLeadToWebhook(submissionData);

    setIsLoading(false);
    if (!success) {
      setError('Erro ao enviar. Tente novamente.');
    }
    return success;
  };

  const renderStep = () => {
    switch (step) {
      case 0: // Welcome
        return (
          <div className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-center">
              <Rocket className="text-green-500 animate-bounce" size={56} />
            </div>
            <h2 className="text-4xl font-black text-gray-900 leading-tight">
              Sua empresa está pronta para 2026?
            </h2>
            <p className="text-gray-500 text-lg">
              Descubra o quanto sua empresa está deixando de ganhar no WhatsApp.
            </p>
            <button
              onClick={next}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-5 px-8 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 group text-xl"
            >
              Começar Diagnóstico
              <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        );

      case 1: // Nome
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-2xl font-bold text-gray-900">Pra começar, qual seu nome?</h3>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                autoFocus
                type="text"
                placeholder="Seu nome aqui..."
                value={quizData.name}
                onChange={(e) => updateQuiz('name', e.target.value)}
                className="w-full border-2 border-gray-100 bg-gray-50 p-5 pl-12 rounded-2xl text-xl text-gray-900 focus:border-green-500 transition-all outline-none"
              />
            </div>
            <button
              disabled={!quizData.name}
              onClick={next}
              className={`w-full font-bold py-5 rounded-2xl transition-all ${quizData.name ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}
            >
              Prazer, {quizData.name || '...'}! Continuar
            </button>
          </div>
        );

      case 2: // Tem empresa?
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-2xl font-bold text-gray-900">
              {quizData.name.split(' ')[0]}, você tem uma empresa hoje?
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <button onClick={() => { updateQuiz('hasCompany', 'Sim'); next(); }} className="p-5 border-2 border-gray-100 rounded-2xl text-left font-bold text-gray-900 hover:border-green-500 hover:bg-green-50 transition-all flex items-center justify-between">
                Sim, eu tenho <ChevronRight className="text-gray-300" />
              </button>
              <button onClick={() => { updateQuiz('hasCompany', 'Autônomo'); setStep(4); }} className="p-5 border-2 border-gray-100 rounded-2xl text-left font-bold text-gray-900 hover:border-green-500 hover:bg-green-50 transition-all flex items-center justify-between">
                Sou Autônomo <ChevronRight className="text-gray-300" />
              </button>
              <button onClick={() => { updateQuiz('hasCompany', 'Não'); setStep(4); }} className="p-5 border-2 border-gray-100 rounded-2xl text-left font-bold text-gray-900 hover:border-green-500 hover:bg-green-50 transition-all flex items-center justify-between">
                Ainda Não <ChevronRight className="text-gray-300" />
              </button>
            </div>
          </div>
        );

      case 3: // Nome da Empresa (Apenas se Sim)
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-2xl font-bold text-gray-900">Qual o nome da sua empresa?</h3>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                autoFocus
                type="text"
                placeholder="Nome da empresa..."
                value={quizData.companyName}
                onChange={(e) => updateQuiz('companyName', e.target.value)}
                className="w-full border-2 border-gray-100 bg-gray-50 p-5 pl-12 rounded-2xl text-xl text-gray-900 focus:border-green-500 transition-all outline-none"
              />
            </div>
            <button
              disabled={!quizData.companyName}
              onClick={next}
              className={`w-full font-bold py-5 rounded-2xl transition-all ${quizData.companyName ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}
            >
              Continuar
            </button>
          </div>
        );

      case 4: // Faturamento
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-green-500" />
              <h3 className="text-2xl font-bold text-gray-900">Quanto você fatura em média no mês?</h3>
            </div>
            <div className="space-y-8 py-4">
              <div className="text-center">
                <span className="text-4xl font-black text-green-600">R$ {quizData.revenue.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max="500000"
                step="5000"
                value={quizData.revenue}
                onChange={(e) => updateQuiz('revenue', parseInt(e.target.value))}
                className="w-full h-3 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
              <div className="flex justify-between text-xs font-bold text-gray-400 uppercase">
                <span>Iniciante</span>
                <span>Escalando</span>
                <span>Elite</span>
              </div>
            </div>
            <button onClick={next} className="w-full bg-green-500 text-white font-bold py-5 rounded-2xl shadow-xl">
              Confirmar Valor
            </button>
          </div>
        );

      case 5: // Quem atende?
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-3">
              <MessageSquare className="text-green-500" />
              <h3 className="text-2xl font-bold text-gray-900">Quem atende o WhatsApp hoje?</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <button onClick={() => { updateQuiz('attendant', 'eu'); setStep(9); }} className="p-5 border-2 border-gray-100 rounded-2xl text-left font-bold text-gray-900 hover:border-green-500 hover:bg-green-50 transition-all">
                Eu mesmo
              </button>
              <button onClick={() => { updateQuiz('attendant', 'secretaria'); next(); }} className="p-5 border-2 border-gray-100 rounded-2xl text-left font-bold text-gray-900 hover:border-green-500 hover:bg-green-50 transition-all">
                Uma Secretária
              </button>
              <button onClick={() => { updateQuiz('attendant', 'equipe'); setStep(9); }} className="p-5 border-2 border-gray-100 rounded-2xl text-left font-bold text-gray-900 hover:border-green-500 hover:bg-green-50 transition-all">
                Equipe Comercial
              </button>
            </div>
          </div>
        );

      case 6: // Se faltar?
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-3 text-red-500">
              <ShieldAlert />
              <h3 className="text-2xl font-bold">E se ela faltar um dia?</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <button onClick={() => { updateQuiz('ifMisses', 'tudo para'); next(); }} className="p-5 border-2 border-gray-100 rounded-2xl text-left font-bold text-gray-900 hover:border-red-500 hover:bg-red-50 transition-all">
                O atendimento simplesmente para
              </button>
              <button onClick={() => { updateQuiz('ifMisses', 'sobra pra mim'); next(); }} className="p-5 border-2 border-gray-100 rounded-2xl text-left font-bold text-gray-900 hover:border-amber-500 hover:bg-amber-50 transition-all">
                Sobra tudo pra mim resolver
              </button>
            </div>
          </div>
        );

      case 7: // Treinamento
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-2xl font-bold text-gray-900 leading-tight">
              Se ela sair amanhã... você vai precisar treinar outra pessoa do zero, certo?
            </h3>
            <p className="text-gray-500">Quanto tempo leva esse novo treinamento?</p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => { updateQuiz('trainingTime', 'dias'); next(); }} className="p-5 border-2 border-gray-100 rounded-2xl font-bold text-gray-900 hover:border-green-500 hover:bg-green-50 transition-all">
                Dias
              </button>
              <button onClick={() => { updateQuiz('trainingTime', 'semanas'); next(); }} className="p-5 border-2 border-gray-100 rounded-2xl font-bold text-gray-900 hover:border-green-500 hover:bg-green-50 transition-all">
                Semanas
              </button>
            </div>
          </div>
        );

      case 8: // Clientes perdidos
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 text-center">
            <div className="flex justify-center"><AlertTriangle className="text-red-500" size={48} /></div>
            <h3 className="text-2xl font-bold text-gray-900 leading-tight">
              E nesse tempo de treinamento... <br />
              <span className="text-red-600">Quantos clientes e vendas você perde?</span>
            </h3>
            <button onClick={next} className="w-full bg-gray-900 text-white font-bold py-5 rounded-2xl shadow-lg">
              Perco muitas oportunidades.
            </button>
          </div>
        );

      case 9: // Concorda com a dor da noite?
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-3">
              <Clock className="text-amber-500" />
              <h3 className="text-2xl font-bold text-gray-900">Diagnóstico de Vendas:</h3>
            </div>
            <p className="text-xl text-gray-700 leading-relaxed">
              Concorda comigo que geralmente seus clientes trabalham e quando querem comprar ou agendar com você é <strong>justamente quando não tem ninguém pra atendê-lo?</strong>
            </p>
            <div className="grid grid-cols-1 gap-4">
              <button onClick={() => { updateQuiz('nightPainAgreed', 'Sim'); next(); }} className="p-5 border-2 border-gray-100 rounded-2xl font-bold text-gray-900 hover:border-green-500 hover:bg-green-50 transition-all text-left">
                Sim, infelizmente é verdade
              </button>
              <button onClick={() => { updateQuiz('nightPainAgreed', 'Não'); setStep(11); }} className="p-5 border-2 border-gray-100 rounded-2xl font-bold text-gray-900 hover:border-green-500 hover:bg-green-50 transition-all text-left">
                Não, meu público fala comigo de dia
              </button>
            </div>
          </div>
        );

      case 10: // Consequência do Sim
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 text-center">
            <h3 className="text-2xl font-bold text-gray-900 leading-tight">
              Agora imagina o quanto de cliente você já perdeu porque sabe lá quanto tempo demorou pra ser respondido...
            </h3>
            <div className="p-5 bg-red-50 border border-red-100 rounded-2xl">
              <p className="text-red-700 font-bold">Você está jogando dinheiro fora no horário comercial e fora dele.</p>
            </div>
            <button onClick={next} className="w-full bg-green-500 text-white font-bold py-5 rounded-2xl shadow-xl">
              É verdade. Preciso mudar isso.
            </button>
          </div>
        );

      case 11: // A Realidade do Vendedor Perfeito (Dinâmico)
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 text-center">
            {quizData.nightPainAgreed === 'Não' ? (
              <h3 className="text-3xl font-black text-gray-900 leading-tight italic mb-4">
                "Então hoje sua empresa atende 24/7 sem chicotear ninguém?"
              </h3>
            ) : (
              <h3 className="text-2xl font-bold text-gray-900 leading-tight mb-4">
                Entendi. Chegou a hora de você conhecer o seu próximo melhor funcionário.
              </h3>
            )}

            <div className="bg-gray-900 text-white p-6 rounded-3xl space-y-4 shadow-2xl">
              <p className="text-lg font-medium leading-relaxed">
                Imagine ter um <span className="text-green-400 font-black uppercase tracking-tighter">Vendedor Elite</span> que:
              </p>
              <ul className="text-left space-y-3 text-gray-300 font-bold">
                <li className="flex items-start gap-2">🚀 Nunca dorme</li>
                <li className="flex items-start gap-2">🍽️ Não precisa comer</li>
                <li className="flex items-start gap-2">🩹 Não sente dores nem fica doente</li>
                <li className="flex items-start gap-2">🚫 Nunca chega estressado ou bêbado</li>
              </ul>
            </div>
            <button onClick={next} className="w-full bg-green-500 text-white font-bold py-5 rounded-2xl shadow-xl flex items-center justify-center gap-2 text-xl">
              Isso seria um sonho! <SmilePlus />
            </button>
          </div>
        );

      case 12: // O Pitch Final
        return (
          <div className="space-y-6 animate-in zoom-in-95 duration-500 bg-green-50 p-6 rounded-3xl border border-green-100">
            <div className="flex justify-center mb-4">
              <BrainCircuit className="text-green-600" size={48} />
            </div>
            <h3 className="text-2xl font-black text-green-900 text-center uppercase tracking-tighter">
              A Solução para 2026 está aqui
            </h3>
            <ul className="space-y-4">
              {[
                'Responder em segundos',
                'Atender centenas ao mesmo tempo',
                'Trabalha 7 dias por semana',
                'Agendar automaticamente no CRM',
                'Controle total do seu faturamento'
              ].map(item => (
                <li key={item} className="flex items-center gap-3 text-green-800 font-bold text-lg">
                  <CheckCircle2 size={24} className="text-green-600 shrink-0" /> {item}
                </li>
              ))}
            </ul>
            <button onClick={next} className="w-full bg-green-600 text-white font-black py-5 rounded-2xl shadow-xl mt-4 flex items-center justify-center gap-2 text-xl hover:bg-green-700 transition-colors uppercase tracking-tight">
              como funciona? <HelpCircle size={22} />
            </button>
          </div>
        );

      case 13: // CTA Final e Contato
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-2xl font-bold text-gray-900">
              Que tal sair na frente neste 2026?
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Vamos conversar sem compromisso, <strong>{quizData.name.split(' ')[0]}</strong>? Só quero que você veja o mundo de possibilidades para a <strong>{quizData.companyName || 'sua jornada'}</strong>.
            </p>

            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  value={formData.email}
                  onChange={(e) => setFormData(f => ({ ...f, email: e.target.value }))}
                  className="w-full border-2 border-gray-100 bg-gray-50 p-4 pl-12 rounded-xl text-gray-900 outline-none focus:border-green-500"
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input
                  type="tel"
                  placeholder="Seu WhatsApp com DDD"
                  value={formData.phone}
                  onChange={(e) => setFormData(f => ({ ...f, phone: e.target.value }))}
                  className="w-full border-2 border-gray-100 bg-gray-50 p-4 pl-12 rounded-xl text-gray-900 outline-none focus:border-green-500"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}

            <button
              disabled={isLoading}
              onClick={async () => {
                const results = await handleSubmit();
                if (results) {
                  setStep(99);
                  setTimeout(() => setStep(100), 2500);
                }
              }}
              className={`w-full py-5 rounded-2xl font-bold text-white text-xl shadow-xl transition-all ${isLoading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {isLoading ? 'Conectando...' : 'Liberar Mundo de Possibilidades'}
            </button>
          </div>
        );

      case 99: // Tela de Carregamento/Processamento
        return (
          <div className="text-center space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-center relative">
              <div className="w-24 h-24 border-4 border-green-100 border-t-green-500 rounded-full animate-spin"></div>
              <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-green-500" size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Gerando seu Diagnóstico...</h2>
              <div className="flex flex-col gap-2 max-w-xs mx-auto">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <CheckCircle2 size={14} className="text-green-500" /> Calculando ROI potencial
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <CheckCircle2 size={14} className="text-green-500" /> Analisando gargalos comerciais
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <div className="w-3 h-3 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin"></div> Criando link de acesso prioritário
                </div>
              </div>
            </div>
          </div>
        );

      case 100: // Sucesso
        return (
          <div className="text-center space-y-6 animate-in zoom-in-95 duration-700">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-bounce shadow-inner">
                <CheckCircle2 size={64} />
              </div>
            </div>
            <h2 className="text-4xl font-black text-gray-900">Tudo Pronto!</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Obrigado, <strong>{formData.name.split(' ')[0]}</strong>! <br />
              Seus dados foram enviados. Nosso <strong>Vendedor Elite</strong> já recebeu suas informações e em breve falará com você no WhatsApp.
            </p>
            <div className="p-8 bg-green-50 rounded-3xl text-green-800 font-bold border border-green-200 shadow-sm">
              <p className="text-xl">Diagnóstico enviado com sucesso! 🚀</p>
              <p className="text-sm mt-2 font-medium opacity-80">Fique atento ao seu WhatsApp, entraremos em contato em breve.</p>
            </div>
            <button onClick={() => window.location.reload()} className="w-full text-green-600 font-black py-4 text-sm uppercase tracking-widest hover:text-green-800 transition-colors">
              Página Inicial
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo BotConversa */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-2">
            <img
              src="https://feliphequeiroz.com/wp-content/uploads/2025/06/Logo-BotConversa-preto-feliphe-queiroz-afiliados-1024x256.png"
              alt="BotConversa Logo"
              className="h-14 w-auto object-contain"
            />
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-gray-100"></span>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Tecnologia Elite 2026</p>
            <span className="h-px w-8 bg-gray-100"></span>
          </div>
        </div>

        {/* Card Content */}
        <div className="bg-white p-2">
          {renderStep()}
        </div>

        {/* Back Button */}
        {step > 0 && step < 100 && (
          <button
            onClick={back}
            className="mt-8 text-gray-300 hover:text-gray-600 flex items-center gap-1 font-medium transition-all text-sm"
          >
            <ChevronLeft size={16} /> Voltar
          </button>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-200 text-[10px] font-bold uppercase tracking-[0.2em]">
          <p>© 2026 BotConversa</p>
        </div>

      </div>
    </div>
  );
};

export default App;
