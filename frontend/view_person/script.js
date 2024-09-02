document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (id) {
      try {
        const response = await fetch(`http://localhost:3000/personas/${id}`);
        if (response.ok) {
          const persona = await response.json();
          
          document.querySelector("#nombre").textContent = `${persona.nombre} ${persona.apellido}`;
          document.querySelector("#email").textContent = persona.email;
          document.querySelector("#cedula").textContent = `C.I: ${persona.cedula}`;
          document.querySelector("#rut").textContent = `RUT: ${persona.rut}`;
        } else {
          alert("Persona no encontrada");
        }
      } catch (error) {
        console.error("Error al obtener la información de la persona:", error);
      }
    } else {
      alert("ID no especificado");
    }
  });
  