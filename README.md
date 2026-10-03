# Multiverso Academy — Plataforma EdTech de Alto Rendimiento

Plataforma online especializada en la preparación intensiva de opositores (Cuerpo General Administrativo C1/A2 y Auxiliar C2), diseñada con una interfaz limpia, sin distracciones y desacoplada del contenido generado con **NotebookLM de Google**.

---

## 🚀 Arquitectura y Tecnologías

- **Framework:** Next.js 14+ con App Router y TypeScript estricto.
- **Estilos y Diseño:** Tailwind CSS + Radix UI / Shadcn styling, modo oscuro/claro automático y tipografía de alta legibilidad para estudio prolongado.
- **Iconografía:** Lucide React.
- **Gestión de Estado y Progreso:** Sincronización en `localStorage` con soporte seguro para Server-Side Rendering (SSR).
- **Carga de Datos Desacoplada:** Todo el contenido (apuntes, glosarios, preguntas de test, justificaciones jurídicas y esquemas de repaso) reside en archivos JSON estructurados en `data/courses/`.

---

## 📂 Estructura del Proyecto

```
Multiverso Academy/
├── app/
│   ├── globals.css                                  # Tokens de diseño, variables CSS y estilos de lectura
│   ├── layout.tsx                                   # Layout raíz con Navbar persistente y Footer
│   ├── page.tsx                                     # Dashboard principal del alumno (Progreso, Cursos, Atajos)
│   └── courses/
│       └── [courseId]/
│           ├── page.tsx                             # Redirección inteligente al primer tema del curso
│           ├── study/
│           │   └── [topicId]/
│           │       └── page.tsx                     # Visor de apuntes / Knowledge Base sin distracciones
│           └── quiz/
│               └── page.tsx                         # Módulo de test (Modo Práctica y Modo Simulacro)
├── components/
│   ├── ui/                                          # Componentes base (Button, Badge, Card, Progress)
│   ├── layout/                                      # Navbar con modo oscuro y Footer
│   ├── dashboard/                                   # WelcomeBanner, MetricCards, CourseCard
│   ├── study/                                       # StudyReader, StudySidebar, CalloutBox, GlossaryDrawer
│   └── quiz/                                        # PracticeMode, SimulationMode
├── data/
│   └── courses/
│       ├── curso-1.json                             # Temario oficial C1/A2 con 2 temas y 5 preguntas test
│       ├── curso-2.json                             # Mock de Curso 2 (C2) marcado como "Próximamente"
│       └── index.ts                                 # Data Access Layer desacoplado (helpers de consulta)
├── lib/
│   ├── utils.ts                                     # Fórmula de corrección de oposiciones y helpers
│   └── storage.ts                                   # Persistencia local de progreso y notas
├── types/
│   ├── course.ts                                    # Esquemas TypeScript para cursos, temas y callouts
│   └── quiz.ts                                      # Esquemas TypeScript para preguntas y simulacros
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🧠 Integración del Contenido de NotebookLM

Para actualizar o añadir un nuevo curso o tema procesado con NotebookLM:

1. **Añadir o editar temas en `data/courses/curso-1.json`**:
   - `summaryPoints`: Puntos clave condensados por NotebookLM.
   - `mindsets`: Preguntas trampa o alertas para evitar errores comunes en el examen.
   - `glossary`: Términos jurídicos esenciales con su artículo de referencia.
   - `callouts`: Bloques destacados de tipo `key_point`, `exam_faq`, `trap_warning` o `notebooklm_insight`.

2. **Añadir preguntas tipo test en la clave `questions`**:
   - `question`: Enunciado de examen.
   - `options`: 4 opciones (A, B, C, D).
   - `correctOptionId`: Opción correcta.
   - `explanation`: Justificación jurídica detallada extraída de NotebookLM.
   - `articleReference`: Artículo legal exacto (ej. *Art. 30.2 LPACAP*).
   - `trapInsight`: Explicación de por qué las otras opciones son engañosas.

---

## 🎯 Módulos Implementados

### 1. Dashboard del Alumno (`/`)
- Mensaje de bienvenida personalizado con branding de **Multiverso Academy**.
- Métricas en tiempo real: porcentaje de temario completado, media sobre 10 y número de tests realizados.
- Selector de curso: **Curso 1 (Activo)** y **Curso 2 (Próximamente)**.
- Atajos de estudio directo a cada tema y a los modos de test.

### 2. Visor de Temario y Apuntes (`/courses/curso-1/study/tema-1`)
- Barra lateral con el árbol de módulos y temas completados con checkmarks.
- Área de lectura optimizada (*Focus Study Mode*) sin elementos distractores.
- Cajetines de llamada visual (*Callouts*) para puntos clave, advertencias de trampa y preguntas frecuentes de examen.
- Cajón deslizable de **Glosario de Términos** con buscador en tiempo real.
- Botón interactivo para marcar el tema como **"Completado / Repasado"**.

### 3. Banco y Motor Interactivo de Test (`/courses/curso-1/quiz`)
- **Modo Práctica:** Pregunta a pregunta con retroalimentación instantánea, desglose del motivo de acierto/fallo y referencia legal.
- **Modo Simulacro:** Temporizador con cuenta regresiva, matriz de navegación rápida entre preguntas, entrega de examen y cálculo de nota oficial sobre 10 con penalización por fallos (`Aciertos - Errores * 0.33`).
- Desglose final de porcentaje de acierto por tema.

---

## 💻 Comandos Útiles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción y verificar tipos TypeScript
npm run build

# Iniciar servidor de producción
npm start
```
