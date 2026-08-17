// Componente del logo de ConectaPo
export default function ConectaPoLogo({
  height = 40,
  inverted = false
}: {
  height?: number
  inverted?: boolean
}) {

  // Define el color azul/teal del logo.
  // Si inverted es true, se utiliza blanco.
  const teal = inverted ? '#ffffff' : '#1B5C7A'

  // Define el color naranja del logo.
  // Si inverted es true, se utiliza blanco.
  const orange = inverted ? '#ffffff' : '#F97316'

  // Color utilizado para el texto "Conecta"
  const textTeal = inverted ? '#ffffff' : '#1B5C7A'

  // Color utilizado para el texto "po"
  const textOrange = inverted ? '#ffffff' : '#F97316'

  // Proporción original del SVG:
  // ancho 220 / alto 72
  // Esto permite mantener las proporciones del logo.
  const aspect = 220 / 72

  // Calcula automáticamente el ancho dependiendo
  // de la altura que recibió el componente.
  const width = height * aspect

  return (
    // SVG principal del logo.
    <svg
      width={width}
      height={height}
      viewBox="0 0 220 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="ConectaPo"
    >

      {/* Grupo que contiene el ícono del logo */}
      <g transform="translate(0, 2)">

        {/* Parte curva naranja del ícono */}
        <path
          d="M28 4 A22 22 0 0 1 28 44"
          stroke={orange}
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Línea vertical principal del ícono */}
        <line
          x1="6"
          y1="4"
          x2="6"
          y2="62"
          stroke={teal}
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Línea horizontal superior */}
        <line
          x1="6"
          y1="4"
          x2="28"
          y2="4"
          stroke={teal}
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Línea horizontal central */}
        <line
          x1="6"
          y1="44"
          x2="28"
          y2="44"
          stroke={teal}
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Puntos del ícono */}
        <circle cx="6" cy="4" r="4" fill={teal} />
        <circle cx="28" cy="4" r="4" fill={teal} />
        <circle cx="6" cy="24" r="3.5" fill={teal} />
        <circle cx="6" cy="44" r="4" fill={teal} />
        <circle cx="28" cy="44" r="4" fill={orange} />
        <circle cx="6" cy="62" r="4" fill={teal} />

        {/* Líneas diagonales que conectan los puntos */}
        <line
          x1="6"
          y1="4"
          x2="28"
          y2="44"
          stroke={teal}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
        />

        <line
          x1="28"
          y1="4"
          x2="6"
          y2="44"
          stroke={teal}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* Elemento gráfico central */}
        <g transform="translate(10, 16)">

          {/* Línea izquierda */}
          <path
            d="M2 14 C2 14 5 10 8 11 L13 13"
            stroke={teal}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Línea derecha */}
          <path
            d="M20 14 C20 14 17 10 14 11 L13 13"
            stroke={orange}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Elemento central */}
          <ellipse
            cx="13"
            cy="13.5"
            rx="3"
            ry="2.5"
            fill="none"
            stroke={teal}
            strokeWidth="1.5"
          />
        </g>

        {/* Pequeños elementos naranjas del ícono */}
        <g transform="translate(32, 10)">
          <circle cx="3" cy="3" r="2" fill={orange} />
          <circle cx="8" cy="1.5" r="1.5" fill={orange} />
          <circle cx="12.5" cy="3" r="1.5" fill={orange} />
          <ellipse
            cx="7.5"
            cy="8"
            rx="4"
            ry="3"
            fill={orange}
          />
        </g>
      </g>

      {/* Texto "Conecta" del logo */}
      <text
        x="56"
        y="50"
        fontFamily="'Plus Jakarta Sans', sans-serif"
        fontWeight="800"
        fontSize="26"
        fill={textTeal}
        letterSpacing="-0.5"
      >
        Conecta
      </text>

      {/* Texto "po" del logo */}
      <text
        x="155"
        y="50"
        fontFamily="'Plus Jakarta Sans', sans-serif"
        fontWeight="800"
        fontSize="26"
        fill={textOrange}
        letterSpacing="-0.5"
      >
        po
      </text>

      {/* Punto naranja que acompaña al texto */}
      <circle
        cx="183"
        cy="38"
        r="2.5"
        fill={textOrange}
      />

    </svg>
  )
}