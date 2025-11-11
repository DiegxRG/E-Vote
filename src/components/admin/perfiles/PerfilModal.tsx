import React, { useState, useEffect } from 'react';
import type { CandidatoConPerfil, Perfil } from '../../../hooks/usePerfiles';

// 🚨 1. IMPORTACIONES ACTUALIZADAS: Añadimos TextAlign y los nuevos iconos
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align'; // <-- La extensión que instalaste
import { 
  FaBold, FaItalic, FaListOl, FaListUl, FaUndo, FaRedo, 
  FaParagraph, FaAlignLeft, FaAlignCenter, FaAlignRight 
} from 'react-icons/fa';
// Importamos 'Heading' para los botones H1/H2

interface PerfilModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidatoConPerfil | null;
  onSave: (data: Partial<Perfil>) => Promise<void>;
  onFetchDetallado: (candidateId: string) => Promise<Perfil | null>;
}

// 🚨 2. BARRA DE HERRAMIENTAS MEJORADA
const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;
  const btnClass = "p-2 rounded hover:bg-gray-200";
  const activeBtnClass = "bg-slate-800 text-white p-2 rounded";
  
  return (
    <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-t-md bg-gray-50">
      {/* --- Títulos --- */}
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? activeBtnClass : btnClass + " font-bold"}>
        H1
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? activeBtnClass : btnClass + " font-bold"}>
        H2
      </button>
      <button type="button" onClick={() => editor.chain().focus().setParagraph().run()} className={editor.isActive('paragraph') ? activeBtnClass : btnClass}>
        <FaParagraph />
      </button>
      {/* --- Estilos --- */}
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? activeBtnClass : btnClass}>
        <FaBold />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? activeBtnClass : btnClass}>
        <FaItalic />
      </button>
      {/* --- Listas --- */}
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? activeBtnClass : btnClass}>
        <FaListUl />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? activeBtnClass : btnClass}>
        <FaListOl />
      </button>
      {/* --- Alineación --- */}
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? activeBtnClass : btnClass}>
        <FaAlignLeft />
      </button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? activeBtnClass : btnClass}>
        <FaAlignCenter />
      </button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? activeBtnClass : btnClass}>
        <FaAlignRight />
      </button>
      {/* --- Historial --- */}
       <button type="button" onClick={() => editor.chain().focus().undo().run()} className={btnClass}><FaUndo /></button>
       <button type="button" onClick={() => editor.chain().focus().redo().run()} className={btnClass}><FaRedo /></button>
    </div>
  );
};


export default function PerfilModal({ isOpen, onClose, candidate, onSave, onFetchDetallado }: PerfilModalProps) {
  
  const [bannerUrl, setBannerUrl] = useState('');
  const [action1Url, setAction1Url] = useState('');
  const [action2Url, setAction2Url] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🚨 3. CONFIGURACIÓN DEL EDITOR ACTUALIZADA
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { // Aseguramos que heading esté configurado
          levels: [1, 2, 3],
        },
      }),
      TextAlign.configure({ // Configuramos la alineación
        types: ['heading', 'paragraph'],
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose max-w-none p-3 border-b border-x border-gray-300 rounded-b-md min-h-[150px] focus:outline-none focus:border-red-500',
      },
    },
  });

  // ... (El useEffect de Cargar Datos se mantiene igual) ...
  useEffect(() => {
    if (isOpen && candidate && editor) { 
      setLoading(true);
      editor.commands.setContent('');
      setBannerUrl('');
      setAction1Url('');
      setAction2Url('');
      
      const loadProfile = async () => {
        const perfil = await onFetchDetallado(candidate.id); 
        if (perfil) {
          editor.commands.setContent(perfil.plan_de_gobierno || ''); 
          setBannerUrl(perfil.photo_banner_url || '');
          setAction1Url(perfil.photo_action_1_url || '');
          setAction2Url(perfil.photo_action_2_url || '');
        }
        setLoading(false);
      };
      loadProfile();
    }
  }, [isOpen, candidate, onFetchDetallado, editor]);


  // ... (El handleSubmit se mantiene igual) ...
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidate || !editor) return;
    setIsSubmitting(true);
    
    const perfilData: Partial<Perfil> = {
      candidate_id: candidate.id,
      plan_de_gobierno: editor.getHTML(),
      photo_banner_url: bannerUrl || null,
      photo_action_1_url: action1Url || null,
      photo_action_2_url: action2Url || null,
    };
    
    try {
      await onSave(perfilData as any); 
      onClose();
    } catch (error) {
      console.error("Error al guardar el perfil:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // ... (El useEffect de [editor] se mantiene igual) ...
  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* ... (Cabecera del Modal se mantiene igual) ... */}
        <div className="p-4 border-b">
          <h2 className="text-2xl font-bold text-slate-800">Editor de Perfil del Candidato</h2>
          <p className="text-gray-500">{candidate.full_name}</p>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-600">Cargando perfil existente...</div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Editor "Tipo Word" (TipTap) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plan de Gobierno (Detallado)
              </label>
              <MenuBar editor={editor} />
              <EditorContent editor={editor} />
            </div>
            
            {/* 🚨 4. INPUTS DE FOTOS (CON VISTA PREVIA) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Foto Banner */}
              <div>
                <label htmlFor="bannerUrl" className="block text-sm font-medium text-gray-700">Foto Banner (Principal)</label>
                <input
                  type="url" id="bannerUrl" value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                  placeholder="https://... (URL)"
                />
                {bannerUrl && (
                  <img src={bannerUrl} alt="Vista Previa Banner" className="mt-2 w-full h-24 object-cover rounded-md shadow-sm" />
                )}
              </div>
              
              {/* Foto Acción 1 */}
              <div>
                <label htmlFor="action1Url" className="block text-sm font-medium text-gray-700">Foto Acción 1</label>
                <input
                  type="url" id="action1Url" value={action1Url}
                  onChange={(e) => setAction1Url(e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                  placeholder="https://... (URL)"
                />
                {action1Url && (
                  <img src={action1Url} alt="Vista Previa Acción 1" className="mt-2 w-full h-24 object-cover rounded-md shadow-sm" />
                )}
              </div>
              
              {/* Foto Acción 2 */}
              <div>
                <label htmlFor="action2Url" className="block text-sm font-medium text-gray-700">Foto Acción 2</label>
                <input
                  type="url" id="action2Url" value={action2Url}
                  onChange={(e) => setAction2Url(e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                  placeholder="https://... (URL)"
                />
                {action2Url && (
                  <img src={action2Url} alt="Vista Previa Acción 2" className="mt-2 w-full h-24 object-cover rounded-md shadow-sm" />
                )}
              </div>
            </div>
          </form>
        )}

        {/* ... (Botones del Footer se mantienen igual) ... */}
        <div className="flex justify-end space-x-3 p-4 border-t bg-gray-50 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit} 
            disabled={isSubmitting || loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Perfil'}
          </button>
        </div>
      </div>
    </div>
  );
}