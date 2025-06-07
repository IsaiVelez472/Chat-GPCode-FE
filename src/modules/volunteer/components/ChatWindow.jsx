import React, { useState } from 'react';
import { FaTimesCircle, FaPaperPlane, FaMinus, FaPlus } from 'react-icons/fa';
import './ChatWindow.css';

const ChatWindow = ({ vacancyId, companyName, vacancyTitle, onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  
  // Mock de mensajes de chat para simular una conversación
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'company',
      text: `¡Hola! Gracias por postularte a nuestra vacante de ${vacancyTitle}.`,
      timestamp: new Date(Date.now() - 3600000).toISOString() // 1 hora atrás
    },
    {
      id: 2,
      sender: 'volunteer',
      text: 'Hola, estoy muy interesado en la posición. ¿Podrían darme más detalles sobre el horario?',
      timestamp: new Date(Date.now() - 3500000).toISOString()
    },
    {
      id: 3,
      sender: 'company',
      text: 'Por supuesto, es un horario flexible de 20 horas semanales, principalmente en las tardes.',
      timestamp: new Date(Date.now() - 3400000).toISOString()
    },
    {
      id: 4,
      sender: 'company',
      text: '¿Tienes alguna otra pregunta sobre la vacante?',
      timestamp: new Date(Date.now() - 3300000).toISOString()
    }
  ]);

  // Función para formatear fechas
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() === '') return;
    
    const newMessage = {
      id: messages.length + 1,
      sender: 'volunteer',
      text: message,
      timestamp: new Date().toISOString()
    };
    
    setMessages([...messages, newMessage]);
    
    // Simular respuesta automática después de 1 segundo
    setTimeout(() => {
      const autoResponse = {
        id: messages.length + 2,
        sender: 'company',
        text: '¡Gracias por tu mensaje! Te responderemos lo antes posible.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, autoResponse]);
    }, 1000);
    
    setMessage('');
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={`flex flex-col bg-white rounded-t-lg shadow-lg w-104 ${isMinimized ? 'h-16' : 'h-124'} transition-all duration-200`}>
      {/* Encabezado del chat */}
      <div 
        className="flex justify-between items-center p-4 bg-blue-100 text-blue-800 rounded-t-lg cursor-pointer shadow-sm"
        onClick={toggleMinimize}
      >
        <div className="font-medium truncate flex-grow">
          {companyName} - {vacancyTitle}
        </div>
        <div className="flex items-center">
          <button onClick={(e) => {
            e.stopPropagation();
            toggleMinimize();
          }} className="p-1 hover:bg-blue-100 rounded mr-1 text-blue-800">
            {isMinimized ? <FaPlus size={14} /> : <FaMinus size={14} />}
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose(vacancyId);
            }} 
            className="p-1 hover:bg-blue-100 rounded text-blue-800"
          >
            <FaTimesCircle size={14} />
          </button>
        </div>
      </div>
      
      {/* Contenido del chat (mensajes) */}
      {!isMinimized && (
        <>
          <div className="flex-grow p-4 overflow-y-auto flex flex-col space-y-3 scrollbar-light">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'volunteer' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[70%] rounded-lg p-3 ${
                    msg.sender === 'volunteer' 
                      ? 'bg-blue-50 text-blue-800 shadow-sm border border-blue-100' 
                      : 'bg-gray-50 text-gray-800 shadow-sm border border-gray-100'
                  }`}
                >
                  <p className="text-sm font-medium">{msg.text}</p>
                  <span className="text-xs text-gray-500 mt-1">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Formulario para enviar mensajes */}
          <form 
            onSubmit={handleSubmit}
            className="border-t p-3 flex items-center"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribir mensaje..."
              className="flex-grow border rounded-full px-5 py-2 text-md focus:outline-none focus:ring-1 focus:ring-blue-200 border-blue-100 bg-white"
            />
            <button 
              type="submit"
              className="ml-3 p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 shadow-sm"
            >
              <FaPaperPlane size={16} />
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatWindow;
