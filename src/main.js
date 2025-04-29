import preguntasJson from '../public/preguntas.json'; 
async function procesarPortapapeles() {
  try {
    const textoCopiado = await navigator.clipboard.readText();

    
    const resultados = buscarPregunta(textoCopiado, preguntasJson);
    await navigator.clipboard.writeText('');
    await navigator.clipboard.writeText(JSON.stringify(resultados, null, 2));


  } catch (err) {
    console.error('Error accediendo al portapapeles:', err);
  }
}


function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .replace(/[.,?!¡¿"“”'’]/g, '') 
    .replace(/\s+/g, ' ')         
    .trim();
}


function buscarPregunta(preguntaBuscada, preguntasJson) {
  const normalizada = normalizarTexto(preguntaBuscada);
  const palabrasClave = new Set(normalizada.split(' '));

  let mejoresCoincidencias = [];
  let maxCoincidencias = 0;

  for (const entrada of preguntasJson) {
    const claveNorm = normalizarTexto(entrada.pregunta);
    const palabrasClavePregunta = new Set(claveNorm.split(' '));

    const interseccion = [...palabrasClavePregunta].filter(p => palabrasClave.has(p));
    const numCoincidencias = interseccion.length;

    if (numCoincidencias > maxCoincidencias) {
      maxCoincidencias = numCoincidencias;
      mejoresCoincidencias = [entrada];
    } else if (numCoincidencias === maxCoincidencias && numCoincidencias > 0) {
      mejoresCoincidencias.push(entrada);
    }
  }

  return mejoresCoincidencias;
}


window.addEventListener('focus', () => {
  procesarPortapapeles();
});
