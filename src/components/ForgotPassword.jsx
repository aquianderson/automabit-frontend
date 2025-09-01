import { useState } from 'react';
import { ArrowLeft, Mail, Send, CheckCircle } from 'lucide-react';

const ForgotPassword = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }

    setIsLoading(true);

    // Simular envio de email de recuperação
    setTimeout(() => {
      setIsEmailSent(true);
      setIsLoading(false);
    }, 2000);
  };

  const handleInputChange = (value) => {
    setEmail(value);
    // Limpar erro ao digitar
    if (errors.email) {
      setErrors({});
    }
  };

  const handleBackToLogin = () => {
    setEmail('');
    setIsEmailSent(false);
    setErrors({});
    onBackToLogin();
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Card de Sucesso */}
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Email enviado!</h2>
              <p className="text-gray-600">
                Enviamos as instruções de recuperação de senha para:
              </p>
              <p className="font-medium text-gray-800 mt-2">{email}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Verifique sua caixa de entrada</strong> e siga as instruções no email para redefinir sua senha.
              </p>
              <p className="text-xs text-blue-600 mt-2">
                Não encontrou o email? Verifique a pasta de spam.
              </p>
            </div>

            <button
              onClick={handleBackToLogin}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Voltar ao Login</span>
            </button>

            <div className="mt-4">
              <button
                onClick={() => setIsEmailSent(false)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Enviar para outro email
              </button>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              © 2025 AutomaBit. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card de Recuperação */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <button
              onClick={handleBackToLogin}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Voltar ao login</span>
            </button>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Esqueceu sua senha?</h2>
            <p className="text-gray-600">
              Digite seu email e enviaremos instruções para redefinir sua senha
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="seu@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Botão de Envio */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all ${
                isLoading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>Enviar instruções</span>
                </>
              )}
            </button>
          </form>

          {/* Informações adicionais */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Lembre-se:</strong> O email pode demorar alguns minutos para chegar. 
              Verifique também sua pasta de spam.
            </p>
          </div>

          {/* Suporte */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Ainda com problemas?{' '}
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Entre em contato com o suporte
              </button>
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2025 AutomaBit. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
