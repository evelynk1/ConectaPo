// Componente reutilizable para mostrar la calificación
// de un servicio o profesional.
export default function StarRating({
  rating
}: {
  rating: number
}) {

  return (

    // Contenedor de las estrellas.
    <div className="flex items-center gap-1">

      {/* 
        Creamos 5 estrellas 
      */}
      {[1, 2, 3, 4, 5].map((s) => (

        // Cada estrella necesita una key única.
        <svg
          key={s}

          // Definimos el tamaño de cada estrella.
          //
          // Si el número de la estrella es menor o igual
          // a la calificación redondeada hacia abajo,
          // se muestra amarilla.
          //
          // Si no, se muestra gris.
          className={`w-3.5 h-3.5 ${
            s <= Math.floor(rating)
              ? 'text-amber-400'
              : 'text-slate-200'
          }`}

          // currentColor permite que el SVG utilice
          // el color definido mediante Tailwind.
          fill="currentColor"

          // Define el área de visualización del SVG.
          viewBox="0 0 20 20"
        >

          {/* 
            Forma de una estrella mediante SVG.
          */}
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />

        </svg>
      ))}
    </div>
  )
}