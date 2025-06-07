import React, { useState, useMemo } from "react";
import { FaThumbsUp, FaComment, FaShare, FaPaperPlane } from "react-icons/fa";
import { useAuth } from "../../auth/context/AuthContext";

const Forum = () => {
  const { user } = useAuth();
  
  // Función para obtener iniciales de un nombre
  const getInitials = (name) => {
    if (!name) return "U";
    
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return parts[0].charAt(0).toUpperCase();
  };
  
  // Función para generar un color basado en el nombre
  const getColorFromName = (name) => {
    if (!name) return "#6366F1"; // Color por defecto (indigo-500)
    
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-orange-500",
      "bg-cyan-500"
    ];
    
    // Usar una suma simple de códigos de caracteres para determinar el color
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    
    return colors[sum % colors.length];
  };
  
  // Componente Avatar con iniciales
  const Avatar = ({ name, size = "md" }) => {
    const initials = getInitials(name);
    const colorClass = getColorFromName(name);
    
    const sizeClasses = {
      sm: "w-8 h-8 text-xs",
      md: "w-10 h-10 text-sm",
      lg: "w-12 h-12 text-base"
    };
    
    return (
      <div className={`${sizeClasses[size]} ${colorClass} rounded-full text-white flex items-center justify-center font-medium`}>
        {initials}
      </div>
    );
  };
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Laura Martínez",
      date: "2 de junio de 2025",
      content: "¡Acabo de completar mi primera experiencia como voluntaria en el proyecto de reforestación! Fue una experiencia increíble y muy gratificante. Si alguien tiene dudas sobre postularse, ¡háganlo! Vale totalmente la pena.",
      likes: 24,
      userLiked: false,
      comments: [
        { id: 101, author: "Carlos Ruiz", content: "¿Cómo fue el proceso de postulación?", timestamp: "2 jun 2025" },
        { id: 102, author: "María Gómez", content: "Yo también participé y fue maravilloso. ¡Nos vemos en la próxima jornada!", timestamp: "3 jun 2025" }
      ],
      showComments: false
    },
    {
      id: 2,
      author: "Pedro Jiménez",
      date: "1 de junio de 2025",
      content: "Tengo entrevista mañana para el voluntariado en el Banco de Alimentos. ¿Alguien que ya esté allí puede darme consejos? ¿Cómo es la experiencia?",
      likes: 15,
      userLiked: false,
      comments: [
        { id: 201, author: "Ana Vega", content: "Yo llevo 3 meses. La entrevista es muy relajada, solo quieren conocer tu motivación. La experiencia es genial, muy buen ambiente de trabajo.", timestamp: "1 jun 2025" }
      ],
      showComments: false
    },
    {
      id: 3,
      author: "Sofía Ramírez",
      date: "29 de mayo de 2025",
      content: "Después de 6 meses como voluntaria en la ONG de alfabetización, finalmente me han ofrecido un puesto remunerado como coordinadora. El voluntariado realmente puede abrir puertas profesionales, además de ser una experiencia increíble.",
      likes: 57,
      userLiked: false,
      comments: [],
      showComments: false
    },
    {
      id: 4,
      author: "Miguel Ángel Castro",
      date: "28 de mayo de 2025",
      content: "¿Alguien ha participado en el programa de voluntariado de la Fundación Protección Animal? Me interesa mucho pero quisiera saber qué tareas se realizan.",
      likes: 12,
      userLiked: false,
      comments: [],
      showComments: false
    },
    {
      id: 5,
      author: "Carmen Ortiz",
      date: "27 de mayo de 2025",
      content: "¡Comparto algunas fotos de nuestra jornada de limpieza de playa del fin de semana! Fuimos más de 50 voluntarios y recogimos más de 200kg de plásticos. [Imagen: Voluntarios limpiando playa] [Imagen: Bolsas de basura recolectada]",
      likes: 89,
      userLiked: false,
      comments: [
        { id: 501, author: "Roberto Sánchez", content: "¡Increíble trabajo! ¿Cuándo es la próxima jornada? Me encantaría unirme.", timestamp: "27 may 2025" },
        { id: 502, author: "Lucía Fernández", content: "Las fotos son impactantes. Es triste ver cuánto plástico hay en nuestras playas, pero reconfortante ver a tanta gente comprometida.", timestamp: "27 may 2025" },
        { id: 503, author: "Carmen Ortiz", content: "@Roberto la próxima jornada es el 15 de junio. ¡Te esperamos! Puedes inscribirte en el enlace de mi perfil.", timestamp: "28 may 2025" }
      ],
      showComments: false
    },
    {
      id: 6,
      author: "Javier Moreno",
      date: "25 de mayo de 2025",
      content: "Busco recomendaciones de ONGs que trabajen con niños en situación de vulnerabilidad. Soy profesor y me gustaría ofrecer clases de refuerzo escolar como voluntario.",
      likes: 34,
      userLiked: false,
      comments: [
        { id: 601, author: "Elena Torres", content: "Te recomiendo Educación Sin Fronteras. Llevo 2 años con ellos y la experiencia es muy gratificante. Te dejo su web: www.educacionsinfronteras.org", timestamp: "25 may 2025" },
        { id: 602, author: "Marcos Vidal", content: "Yo colaboro con Ayuda en Acción y tienen un programa específico de refuerzo escolar. Te puedo pasar el contacto de la coordinadora si te interesa.", timestamp: "26 may 2025" }
      ],
      showComments: false
    },
    {
      id: 7,
      author: "Natalia Rivas",
      date: "23 de mayo de 2025",
      content: "Hoy completé mi formación como voluntaria para acompañamiento de personas mayores. [Imagen: Certificado de formación] ¡Lista para empezar esta nueva etapa! Si alguien tiene experiencia en este tipo de voluntariado, agradecería consejos.",
      likes: 45,
      userLiked: false,
      comments: [
        { id: 701, author: "Antonio Méndez", content: "¡Felicidades! Yo llevo 3 años en ese programa. Mi consejo: escucha mucho, tienen historias fascinantes que contar y valoran enormemente que les prestes atención.", timestamp: "23 may 2025" },
        { id: 702, author: "Isabel Ponce", content: "La paciencia es clave. A veces pueden repetir las mismas historias, pero para ellos es importante compartirlas. También te recomiendo llevar algún juego de mesa, funciona genial para romper el hielo.", timestamp: "24 may 2025" },
        { id: 703, author: "Natalia Rivas", content: "¡Gracias por los consejos! Ya tengo preparados algunos juegos y un álbum de fotos antiguas para iniciar conversaciones.", timestamp: "24 may 2025" }
      ],
      showComments: false
    },
    {
      id: 8,
      author: "Daniel López",
      date: "21 de mayo de 2025",
      content: "¿Alguien sabe si hay alguna ONG que necesite voluntarios con conocimientos de programación? Me gustaría contribuir con mis habilidades técnicas.",
      likes: 28,
      userLiked: false,
      comments: [
        { id: 801, author: "Paula Martín", content: "Revisa Code for Good, organizan hackathones para desarrollar soluciones para ONGs. Yo participé el mes pasado y fue una experiencia genial.", timestamp: "21 may 2025" },
        { id: 802, author: "Sergio Blanco", content: "En TechSoup buscan voluntarios para dar formación básica de informática a personas en riesgo de exclusión digital. No es programación avanzada, pero es muy necesario.", timestamp: "22 may 2025" }
      ],
      showComments: false
    },
    {
      id: 9,
      author: "Laura Soto",
      date: "20 de mayo de 2025",
      content: "Después de un año como voluntaria en el comedor social, hoy me despido para comenzar un nuevo proyecto. [Imagen: Grupo de voluntarios del comedor] Gracias a todos por hacer de esta experiencia algo inolvidable. ¡Seguiré apoyando desde donde esté!",
      likes: 67,
      userLiked: false,
      comments: [
        { id: 901, author: "María José Ruiz", content: "¡Te echaremos de menos, Laura! Has sido un pilar fundamental en el equipo. Mucha suerte en tu nuevo proyecto.", timestamp: "20 may 2025" },
        { id: 902, author: "Carlos Durán", content: "Ha sido un placer compartir turnos contigo. Tu energía positiva siempre nos animaba a todos. ¡Éxito en todo lo que emprendas!", timestamp: "20 may 2025" },
        { id: 903, author: "Laura Soto", content: "¡Gracias por vuestras palabras! Prometo venir a visitaros. Esta experiencia me ha cambiado la vida.", timestamp: "21 may 2025" }
      ],
      showComments: false
    },
    {
      id: 10,
      author: "Carmen Blanco",
      date: "26 de mayo de 2025",
      content: "Hoy completé mi primer mes como voluntaria enseñando programación a niños de escuelas públicas. Ver sus caras cuando logran resolver un problema es simplemente increíble. ¡Recomiendo mucho esta experiencia!",
      likes: 42,
      userLiked: false,
      comments: [
        { id: 1001, author: "Gabriel Rodríguez", content: "¿Cómo te uniste a ese programa? Me interesa hacer algo similar.", timestamp: "26 may 2025" },
        { id: 1002, author: "Carmen Blanco", content: "@Gabriel me uní a través de la fundación 'Programando Futuro'. Tienen un proceso de selección muy sencillo, solo necesitas conocimientos básicos y muchas ganas de enseñar.", timestamp: "26 may 2025" },
        { id: 1003, author: "Luis Herrera", content: "¿Qué edades tienen los niños? Yo soy desarrollador y me gustaría contribuir también.", timestamp: "27 may 2025" },
        { id: 1004, author: "Carmen Blanco", content: "@Luis son niños de 10 a 14 años. ¡Te animo a que te unas! Es muy gratificante.", timestamp: "27 may 2025" }
      ],
      showComments: false
    }
  ]);
  const [newComment, setNewComment] = useState("");
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [newPostContent, setNewPostContent] = useState("");
  
  // Función para manejar los likes en los posts
  const handleLikePost = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const userLiked = !post.userLiked;
          return {
            ...post,
            likes: userLiked ? post.likes + 1 : post.likes - 1,
            userLiked
          };
        }
        return post;
      })
    );
  };

  // Función para mostrar u ocultar comentarios
  const toggleComments = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            showComments: !post.showComments
          };
        }
        return post;
      })
    );
  };

  // Función para manejar la entrada de un nuevo comentario
  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  // Función para añadir un comentario
  const addComment = (postId) => {
    if (newComment.trim() === "") return;
    
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const newCommentObj = {
            id: Date.now(),
            author: user?.first_name + " " + user?.last_name || "Usuario",
            content: newComment,
            timestamp: new Date().toLocaleDateString("es-ES", {
              day: "numeric",
              month: "short",
              year: "numeric"
            })
          };
          
          return {
            ...post,
            comments: [...post.comments, newCommentObj],
            showComments: true
          };
        }
        return post;
      })
    );
    
    setNewComment("");
    setActiveCommentPost(null);
  };

  // Función para publicar un nuevo post
  const handleCreatePost = () => {
    if (newPostContent.trim() === "") return;

    // Obtener el nombre completo del usuario actual o usar "Usuario" si no está disponible
    let authorName = "Usuario";
    if (user) {
      if (user.first_name && user.last_name) {
        authorName = `${user.first_name} ${user.last_name}`;
      } else if (user.name) {
        authorName = user.name;
      } else if (user.email) {
        authorName = user.email.split('@')[0];
      }
    }

    const newPost = {
      id: Date.now(),
      author: authorName,
      date: new Date().toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }),
      content: newPostContent,
      likes: 0,
      userLiked: false,
      comments: [],
      showComments: false
    };

    setPosts([newPost, ...posts]);
    setNewPostContent("");
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Foro de Voluntarios</h1>
          <p className="text-gray-600">
            Comparte experiencias, pide consejos y conecta con otros voluntarios.
          </p>
        </div>

        {/* Crear nueva publicación */}
        <div className="bg-white shadow rounded-lg mb-8 p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Avatar name={user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : (user?.name || "Usuario")} size="md" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-4">
                <textarea
                  rows={3}
                  className="shadow-sm block w-full focus:ring-primary-500 focus:border-primary-500 sm:text-sm border border-gray-300 rounded-md bg-white"
                  placeholder="¿Qué quieres compartir hoy?"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCreatePost}
                  disabled={newPostContent.trim() === ""}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${newPostContent.trim() === "" ? "bg-gray-400 cursor-not-allowed" : "bg-primary-500 hover:bg-primary-600"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                >
                  Publicar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feed de publicaciones */}
        {posts.map((post) => (
          <div key={post.id} className="bg-white shadow rounded-lg mb-6 overflow-hidden">
            {/* Cabecera del post */}
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0">
                  <Avatar name={post.author} size="md" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">{post.author}</p>
                  <p className="text-sm text-gray-500">{post.date}</p>
                </div>
              </div>
              <div className="text-base text-gray-800 whitespace-pre-wrap mb-4 text-left">
                {post.content}
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div>
                  {post.likes} {post.likes === 1 ? "Me gusta" : "Me gustas"}
                </div>
                <div>
                  {post.comments.length} {post.comments.length === 1 ? "comentario" : "comentarios"}
                </div>
              </div>
            </div>

            {/* Botones de acciones */}
            <div className="border-t border-b border-gray-200 px-4 py-2 flex justify-around">
              <button
                onClick={() => handleLikePost(post.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition duration-150 ${
                  post.userLiked
                    ? "text-primary-600 font-medium bg-primary-50"
                    : "text-gray-700 hover:bg-gray-50 bg-white"
                }`}
              >
                <FaThumbsUp className={post.userLiked ? "text-primary-500" : "text-gray-500"} />
                <span>Me gusta</span>
              </button>
              <button
                onClick={() => toggleComments(post.id)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 rounded-md hover:bg-gray-50 transition duration-150 bg-white"
              >
                <FaComment className="text-gray-500" />
                <span>Comentar</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 rounded-md hover:bg-gray-50 transition duration-150 bg-white">
                <FaShare className="text-gray-500" />
                <span>Compartir</span>
              </button>
            </div>

            {/* Sección de comentarios */}
            {post.showComments && (
              <div className="p-4">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3 py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex-shrink-0">
                      <Avatar name={comment.author} size="sm" />
                    </div>
                    <div className="flex-grow">
                      <div className="bg-white rounded-2xl px-4 py-2 border border-gray-100">
                        <div className="font-medium text-gray-900 text-sm text-left">{comment.author}</div>
                        <p className="text-gray-800 text-sm mt-1 text-left">{comment.content}</p>
                      </div>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <span>{comment.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Formulario para añadir comentario */}
                <div className="flex items-start space-x-3 mt-4">
                  <div className="flex-shrink-0">
                    <Avatar name={user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : (user?.name || "Usuario")} size="sm" />
                  </div>
                  <div className="flex-grow relative rounded-full">
                    <input
                      type="text"
                      className="bg-white p-3 rounded-full w-full pr-12 focus:outline-none border border-gray-200 focus:border-primary-300 focus:ring-1 focus:ring-primary-300"
                      placeholder="Escribe un comentario..."
                      value={activeCommentPost === post.id ? newComment : ""}
                      onChange={handleCommentChange}
                      onFocus={() => setActiveCommentPost(post.id)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && activeCommentPost === post.id) {
                          addComment(post.id);
                        }
                      }}
                    />
                    <button
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-500 hover:text-primary-600"
                      onClick={() => activeCommentPost === post.id && addComment(post.id)}
                    >
                      <FaPaperPlane />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forum;
