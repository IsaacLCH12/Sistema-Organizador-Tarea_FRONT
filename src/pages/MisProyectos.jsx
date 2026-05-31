import { useState, useEffect } from 'react';
import ModalUnirse from '../components/ModalUnirse';
import ModalCrear from '../components/ModalCrear';
import { obtenerProyectos, unirseProyecto, crearProyecto } from '../services/proyectoService';

export default function MisProyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [isModalUnirseOpen, setIsModalUnirseOpen] = useState(false);
  const [isModalCrearOpen, setIsModalCrearOpen] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const data = await obtenerProyectos();
    setProyectos(data);
  };

  const handleUnirse = async (codigo) => {
    try {
      await unirseProyecto(codigo);
      alert("¡Te uniste con éxito!");
      setIsModalUnirseOpen(false);
      cargarDatos();
    } catch (error) {
      alert("Código incorrecto o error al unirse.");
    }
  };

  const handleCrear = async (datosProyecto) => {
    try {
      await crearProyecto(datosProyecto);
      alert("¡Proyecto creado con éxito! Eres el Líder.");
      setIsModalCrearOpen(false);
      cargarDatos();
    } catch (error) {
      alert("Error al intentar crear el proyecto.");
    }
  };

  return (
    <div style={styles.layout}>
      {/* BARRA LATERAL */}
      <aside style={styles.sidebar}>
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>SF</div>
          <h2 style={styles.logoText}>StudyFlow</h2>
        </div>
        <nav style={styles.nav}>
          <a href="#" style={{...styles.navItem, ...styles.navItemActive}}>📁 Mis Proyectos</a>
          <a href="#" style={styles.navItem}>📊 Tableros</a>
          <a href="#" style={styles.navItem}>⚙️ Configuración</a>
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main style={styles.mainContent}>
        {/* CABECERA */}
        <header style={styles.header}>
          <div>
            <h1 style={styles.pageTitle}>Espacios de Trabajo</h1>
            <p style={styles.pageSubtitle}>Gestiona tus proyectos y equipos de estudio</p>
          </div>
          
          {/* NUEVA ZONA DE BOTONES */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={styles.secondaryButton} onClick={() => setIsModalUnirseOpen(true)}>
              🔗 Unirse a Proyecto
            </button>
            <button style={styles.primaryButton} onClick={() => setIsModalCrearOpen(true)}>
              + Crear Proyecto
            </button>
          </div>
        </header>

        {/* CUADRÍCULA DE PROYECTOS */}
        <div style={styles.gridContainer}>
          {!Array.isArray(proyectos) || proyectos.length === 0 ? (
            <div style={styles.emptyState}>
              <span style={styles.emptyIcon}>📂</span>
              <h3>No tienes proyectos activos</h3>
              <p>Crea un proyecto nuevo o únete a uno usando un código de invitación.</p>
            </div>
          ) : (
            proyectos.map((proy, index) => (
              <div key={index} style={styles.projectCard}>
                <div style={styles.cardHeader}>
                  <div style={styles.projectIcon}>{proy.nombre ? proy.nombre.charAt(0).toUpperCase() : 'P'}</div>
                  <span style={styles.statusBadge}>Activo</span>
                </div>
                <h3 style={styles.cardTitle}>{proy.nombre || "Proyecto sin nombre"}</h3>
                <p style={styles.cardDescription}>{proy.descripcion || "Sin descripción asignada."}</p>
                <div style={styles.cardFooter}>
                  <button style={styles.enterButton}>Entrar al Tablero →</button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* MODALES */}
      <ModalUnirse 
        isOpen={isModalUnirseOpen} 
        onClose={() => setIsModalUnirseOpen(false)}
        onUnirse={handleUnirse}
      />
      <ModalCrear 
        isOpen={isModalCrearOpen} 
        onClose={() => setIsModalCrearOpen(false)}
        onCrear={handleCrear}
      />
    </div>
  );
}

// DICCIONARIO DE ESTILOS (El mismo de antes con pequeños ajustes)
const styles = {
  layout: { display: 'flex', minHeight: '100vh', backgroundColor: '#F4F5F7', fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" },
  sidebar: { width: '240px', backgroundColor: '#FFFFFF', borderRight: '1px solid #DFE1E6', padding: '20px 10px', display: 'flex', flexDirection: 'column' },
  logoContainer: { display: 'flex', alignItems: 'center', marginBottom: '30px', padding: '0 10px' },
  logoIcon: { backgroundColor: '#0052CC', color: 'white', width: '32px', height: '32px', borderRadius: '6px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', marginRight: '10px' },
  logoText: { margin: 0, fontSize: '1.2rem', color: '#172B4D' },
  nav: { display: 'flex', flexDirection: 'column', gap: '5px' },
  navItem: { padding: '10px', textDecoration: 'none', color: '#42526E', borderRadius: '4px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '10px' },
  navItemActive: { backgroundColor: '#E9F2FF', color: '#0052CC' },
  mainContent: { flex: 1, padding: '40px', display: 'flex', flexDirection: 'column' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  pageTitle: { margin: 0, fontSize: '1.8rem', color: '#172B4D' },
  pageSubtitle: { margin: '5px 0 0 0', color: '#5E6C84', fontSize: '0.9rem' },
  primaryButton: { backgroundColor: '#0052CC', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', transition: 'background 0.2s' },
  secondaryButton: { backgroundColor: 'white', color: '#0052CC', border: '1px solid #0052CC', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' },
  enterButton: { backgroundColor: 'transparent', color: '#0052CC', border: '1px solid #0052CC', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', width: '100%' },
  gridContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
  projectCard: { backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #DFE1E6', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, box-shadow 0.2s' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  projectIcon: { width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#FFAB00', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem', fontWeight: 'bold' },
  statusBadge: { backgroundColor: '#E3FCEF', color: '#006644', padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' },
  cardTitle: { margin: '0 0 10px 0', color: '#172B4D', fontSize: '1.2rem' },
  cardDescription: { margin: '0 0 20px 0', color: '#5E6C84', fontSize: '0.9rem', flex: 1 },
  cardFooter: { marginTop: 'auto' },
  emptyState: { gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', backgroundColor: 'white', borderRadius: '8px', border: '1px dashed #DFE1E6' },
  emptyIcon: { fontSize: '3rem', display: 'block', marginBottom: '15px' }
};