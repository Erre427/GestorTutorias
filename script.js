/* =========================================================================
   ESTADO GLOBAL Y DATOS SIMULADOS
   ========================================================================= */
const state = {
    currentUser: null, // 'student' o 'tutor'
    currentView: 'home',
    // Catálogo de materias de Ciencias Básicas y Especialidad
    subjectsCatalogue: [
        { id: 'math1', name: 'Cálculo Diferencial', category: 'Ciencias Básicas' },
        { id: 'math2', name: 'Cálculo Integral', category: 'Ciencias Básicas' },
        { id: 'math3', name: 'Cálculo Vectorial', category: 'Ciencias Básicas' },
        { id: 'phys1', name: 'Física Clásica', category: 'Ciencias Básicas' },
        { id: 'chem1', name: 'Química', category: 'Ciencias Básicas' },
        { id: 'prog1', name: 'Fundamentos de Programación', category: 'Especialidad' },
        { id: 'prog2', name: 'Programación Orientada a Objetos', category: 'Especialidad' },
        { id: 'data1', name: 'Estructura de Datos', category: 'Especialidad' }
    ],
    // Asesores registrados (simulación de base de datos)
    tutors: [
        { id: 't1', name: 'Ing. Carlos Mendoza', subjectId: 'math1', schedule: 'Lunes y Miércoles 10:00 - 12:00', classroom: 'Edificio A, Salón A3', slotsTotal: 15, slotsAvailable: 10, status: 'approved' },
        { id: 't2', name: 'Dra. Ana Silva', subjectId: 'phys1', schedule: 'Martes y Jueves 14:00 - 16:00', classroom: 'Laboratorio L2', slotsTotal: 20, slotsAvailable: 20, status: 'approved' },
        { id: 't3', name: 'M.C. Roberto Ortiz', subjectId: 'prog2', schedule: 'Viernes 16:00 - 18:00', classroom: 'Centro de Cómputo C1', slotsTotal: 10, slotsAvailable: 0, status: 'approved' }
    ],
    // Solicitudes de asesoría de los estudiantes
    requests: [
        { id: 'req1', subjectName: 'Cálculo Diferencial', tutorName: 'Ing. Carlos Mendoza', schedule: 'Lunes y Miércoles 10:00 - 12:00', status: 'approved', studentName: 'Marcos Daniel' },
        { id: 'req2', subjectName: 'Física Clásica', tutorName: 'Dra. Ana Silva', schedule: 'Martes y Jueves 14:00 - 16:00', status: 'pending', studentName: 'Marcos Daniel' }
    ],
    // Catálogo de salones disponibles
    classrooms: [
        'Edificio A - Aula 1',
        'Edificio A - Aula 2',
        'Edificio A - Aula 3',
        'Edificio B - Aula 1',
        'Edificio B - Aula 2',
        'Laboratorio de Cómputo L1',
        'Laboratorio de Cómputo L2',
        'Centro de Información',
        'Sala de Tutorías 1',
        'Sala de Tutorías 2'
    ],
    // Materias registradas por el usuario actual (si es tutor)
    myTutorSubjects: []
};

/* =========================================================================
   INICIALIZACIÓN Y NAVEGACIÓN (SPA)
   ========================================================================= */
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si hay sesión guardada simulada
    const savedUser = localStorage.getItem('sga_user_role');
    if (savedUser) {
        login(savedUser, false);
    } else {
        navigate('home');
    }
});

function navigate(viewId) {
    const container = document.getElementById('app-container');
    const template = document.getElementById(`view-${viewId}`);

    if (!template) {
        console.error(`Vista no encontrada: view-${viewId}`);
        return;
    }

    // Efecto de transición
    container.style.opacity = '0';

    setTimeout(() => {
        // Clonar y montar el template
        container.innerHTML = '';
        container.appendChild(template.content.cloneNode(true));

        // Actualizar estado
        state.currentView = viewId;
        updateNavbarActiveState(viewId);

        // Inicializar datos específicos de la vista
        if (viewId === 'student-panel') initStudentPanel();
        if (viewId === 'tutor-panel') initTutorPanel();
        if (viewId === 'coordinator-panel') initCoordinatorPanel();

        container.style.opacity = '1';
    }, 200); // Coincide con var(--transition-fast)
}

function updateNavbarActiveState(viewId) {
    // Quitar clase active
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    // Añadir clase active al botón correspondiente
    const activeBtn = document.getElementById(`nav-${viewId.replace('-panel', '')}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

/* =========================================================================
   SISTEMA DE AUTENTICACIÓN (SIMULADO)
   ========================================================================= */
function login(role, showToastMsg = true) {
    state.currentUser = role;
    localStorage.setItem('sga_user_role', role);

    const navStudent = document.getElementById('nav-student');
    const navTutor = document.getElementById('nav-tutor');
    const navCoordinator = document.getElementById('nav-coordinator');
    const navProfile = document.getElementById('nav-profile');
    const userNameDisplay = document.getElementById('user-name-display');

    // Ocultar botones no relevantes para el rol
    navStudent.style.display = 'none';
    navTutor.style.display = 'none';
    navCoordinator.style.display = 'none';

    // Mostrar perfil
    navProfile.style.display = 'flex';

    if (role === 'student') {
        navStudent.style.display = 'flex';
        userNameDisplay.textContent = 'Alumno TecNM';
        if (showToastMsg) showToast('¡Bienvenido, Estudiante!', 'success');
        navigate('student-panel');
    } else if (role === 'tutor') {
        navTutor.style.display = 'flex';
        userNameDisplay.textContent = 'Asesor TecNM';
        if (showToastMsg) showToast('¡Bienvenido, Asesor!', 'success');
        navigate('tutor-panel');
    } else if (role === 'coordinator') {
        navCoordinator.style.display = 'flex';
        userNameDisplay.textContent = 'Coordinación';
        if (showToastMsg) showToast('¡Bienvenido, Coordinador!', 'success');
        navigate('coordinator-panel');
    }
}

function logout() {
    state.currentUser = null;
    localStorage.removeItem('sga_user_role');

    document.getElementById('nav-student').style.display = 'none';
    document.getElementById('nav-tutor').style.display = 'none';
    document.getElementById('nav-coordinator').style.display = 'none';
    document.getElementById('nav-profile').style.display = 'none';

    showToast('Sesión cerrada correctamente', 'info');
    navigate('home');
}

/* =========================================================================
   LÓGICA DEL PANEL DE ESTUDIANTE
   ========================================================================= */
function initStudentPanel() {
    const tbody = document.getElementById('student-requests-body');
    const emptyState = document.getElementById('student-empty-state');

    let pendingCount = 0;
    let approvedCount = 0;

    tbody.innerHTML = ''; // Limpiar tabla

    if (state.requests.length === 0) {
        tbody.parentElement.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        tbody.parentElement.style.display = 'table';

        state.requests.forEach(req => {
            const tr = document.createElement('tr');

            // Determinar clases de estado
            let statusBadge = '';
            let statusText = '';

            if (req.status === 'pending') {
                statusBadge = 'status-pending';
                statusText = 'Pendiente';
                pendingCount++;
            } else if (req.status === 'approved') {
                statusBadge = 'status-approved';
                statusText = 'Aprobada';
                approvedCount++;
            } else {
                statusBadge = 'status-rejected';
                statusText = 'Rechazada';
            }

            tr.innerHTML = `
                <td><strong>${req.subjectName}</strong></td>
                <td>${req.tutorName}</td>
                <td><i class="ph ph-clock text-muted"></i> ${req.schedule}</td>
                <td><i class="ph ph-door"></i> ${req.classroom || 'N/A'}</td>
                <td><span class="status-badge ${statusBadge}">${statusText}</span></td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Actualizar contadores
    document.getElementById('student-stat-pending').textContent = pendingCount;
    document.getElementById('student-stat-approved').textContent = approvedCount;

    // Llenar select de materias en el modal
    populateSubjectsSelect();
}

function populateSubjectsSelect() {
    const select = document.getElementById('req-subject');
    if (!select) return;

    // Limpiar opciones exceptuando la primera
    select.innerHTML = '<option value="">Selecciona una materia...</option>';

    // Agrupar por categoría
    const cbGroup = document.createElement('optgroup');
    cbGroup.label = 'Ciencias Básicas';

    const espGroup = document.createElement('optgroup');
    espGroup.label = 'Materias de Especialidad';

    state.subjectsCatalogue.forEach(sub => {
        const option = document.createElement('option');
        option.value = sub.id;
        option.textContent = sub.name;

        if (sub.category === 'Ciencias Básicas') {
            cbGroup.appendChild(option);
        } else {
            espGroup.appendChild(option);
        }
    });

    select.appendChild(cbGroup);
    select.appendChild(espGroup);
}

function updateAvailableTutors() {
    const subjectId = document.getElementById('req-subject').value;
    const tutorSelect = document.getElementById('req-tutor');

    // Resetear select
    tutorSelect.innerHTML = '<option value="">Selecciona un asesor...</option>';

    if (!subjectId) {
        tutorSelect.disabled = true;
        tutorSelect.innerHTML = '<option value="">Selecciona la materia primero...</option>';
        return;
    }

    // Buscar tutores que den esa materia y que estén aprobados
    const availableTutors = state.tutors.filter(t => t.subjectId === subjectId && t.status === 'approved');

    if (availableTutors.length === 0) {
        tutorSelect.innerHTML = '<option value="">No hay asesores disponibles para esta materia</option>';
        tutorSelect.disabled = true;
    } else {
        availableTutors.forEach(tutor => {
            const option = document.createElement('option');
            option.value = tutor.id;
            // Guardar datos en atributos de datos para uso posterior
            option.dataset.name = tutor.name;
            option.dataset.schedule = tutor.schedule;
            option.dataset.classroom = tutor.classroom;
            option.dataset.available = tutor.slotsAvailable;

            if (tutor.slotsAvailable <= 0) {
                option.textContent = `${tutor.name} (${tutor.schedule}) - LLENO`;
                option.disabled = true;
            } else {
                option.textContent = `${tutor.name} (${tutor.schedule})`;
            }
            tutorSelect.appendChild(option);
        });
        tutorSelect.disabled = false;
        updateSelectedTutorInfo();
    }
}

function updateSelectedTutorInfo() {
    const tutorSelect = document.getElementById('req-tutor');
    const helpText = document.getElementById('tutor-info-help');

    if (!tutorSelect || !tutorSelect.value) {
        if (helpText) helpText.style.display = 'none';
        return;
    }

    const selectedOption = tutorSelect.options[tutorSelect.selectedIndex];
    const classroom = selectedOption.dataset.classroom || 'N/A';
    const available = selectedOption.dataset.available;

    if (helpText) {
        helpText.innerHTML = `<i class="ph-bold ph-door"></i> Salón: ${classroom} <span style="margin: 0 0.5rem;">|</span> <i class="ph-bold ph-users"></i> Cupos disponibles: ${available}`;
        helpText.style.display = 'block';
    }
}

function submitTutoringRequest(event) {
    event.preventDefault();

    const subjectSelect = document.getElementById('req-subject');
    const tutorSelect = document.getElementById('req-tutor');
    // const topicInput = document.getElementById('req-topic');

    const subjectName = subjectSelect.options[subjectSelect.selectedIndex].text;
    const selectedTutorOption = tutorSelect.options[tutorSelect.selectedIndex];
    const tutorId = tutorSelect.value;

    // Decrementar cupos
    const tutorObj = state.tutors.find(t => t.id === tutorId);
    if (tutorObj && tutorObj.slotsAvailable > 0) {
        tutorObj.slotsAvailable--;
    }

    const newRequest = {
        id: 'req_' + Date.now(),
        subjectName: subjectName,
        tutorName: selectedTutorOption.dataset.name,
        schedule: selectedTutorOption.dataset.schedule,
        classroom: selectedTutorOption.dataset.classroom,
        status: 'pending',
        studentName: 'Alumno TecNM'
    };

    // Añadir al inicio del arreglo
    state.requests.unshift(newRequest);

    closeModal('modal-request-tutoring');
    showToast('Solicitud enviada exitosamente', 'success');

    // Refrescar vista
    initStudentPanel();
}

/* =========================================================================
   LÓGICA DEL PANEL DE ASESOR
   ========================================================================= */
function initTutorPanel() {
    renderTutorSubjects();
    renderTutorRequests();

    // Actualizar contadores
    document.getElementById('tutor-stat-subjects').textContent = state.myTutorSubjects.filter(s => s.status === 'approved').length;
    document.getElementById('tutor-stat-pending-subjects').textContent = state.myTutorSubjects.filter(s => s.status === 'pending').length;
    // Solicitudes recibidas basadas en las materias del tutor
    const totalRequests = document.querySelectorAll('.requests-list .list-item').length;
    document.getElementById('tutor-stat-requests').textContent = totalRequests;
}

function renderTutorSubjects() {
    const listContainer = document.getElementById('tutor-subjects-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';

    if (state.myTutorSubjects.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <i class="ph ph-books"></i>
                <p>No tienes materias registradas para dar asesoría.</p>
            </div>
        `;
        return;
    }

    state.myTutorSubjects.forEach(sub => {
        let statusClass = sub.status === 'approved' ? 'status-approved' : (sub.status === 'rejected' ? 'status-rejected' : 'status-pending');
        let statusText = sub.status === 'approved' ? 'Aprobada' : (sub.status === 'rejected' ? 'Rechazada' : 'Pendiente Rev.');
        let roomInfo = sub.classroom ? ` | <i class="ph ph-door"></i> Salón: <strong>${sub.classroom}</strong>` : '';

        const item = document.createElement('div');
        item.className = 'list-item fade-in';
        item.innerHTML = `
            <div class="list-item-header">
                <span class="list-item-title">${sub.name}</span>
                <span class="status-badge ${statusClass}">${statusText}</span>
            </div>
            <div class="list-item-body">
                <p><i class="ph ph-calendar"></i> Horario: <strong>${sub.schedule}</strong>${roomInfo}</p>
                <p><i class="ph ph-users"></i> Cupos solicitados: <strong>${sub.capacity}</strong></p>
            </div>
        `;
        listContainer.appendChild(item);
    });
}

function renderTutorRequests() {
    const listContainer = document.getElementById('tutor-requests-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';

    // Filtrar solicitudes (simular que vemos las dirigidas a 'Asesor TecNM')
    // Nota: Como es una simulación general estática, mostraremos algunas "falsas" o recibidas

    const myReceivedRequests = [
        { id: 'recv1', student: 'Juan Pérez', subject: 'Cálculo Diferencial', topic: 'Dudas con derivadas', status: 'pending' },
        { id: 'recv2', student: 'María López', subject: 'Cálculo Diferencial', topic: 'Regla de la cadena', status: 'approved' }
    ];

    if (myReceivedRequests.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <i class="ph ph-tray"></i>
                <p>No tienes solicitudes de alumnos por el momento.</p>
            </div>
        `;
        return;
    }

    myReceivedRequests.forEach(req => {
        const statusHTML = req.status === 'pending'
            ? `<button class="btn btn-sm btn-primary" onclick="approveRequest('${req.id}')">Aceptar</button>`
            : `<span class="status-badge status-approved"><i class="ph ph-check"></i> Aprobada</span>`;

        const item = document.createElement('div');
        item.className = 'list-item fade-in';
        item.innerHTML = `
            <div class="list-item-header">
                <span class="list-item-title">${req.student}</span>
                <span class="text-muted" style="font-size: 0.8rem;">${req.subject}</span>
            </div>
            <div class="list-item-body" style="margin-bottom: 0.5rem;">
                <p><strong>Tema:</strong> ${req.topic}</p>
            </div>
            <div style="display: flex; justify-content: flex-end;">
                ${statusHTML}
            </div>
        `;
        listContainer.appendChild(item);
    });
}

function submitSubjectRegistration(event) {
    event.preventDefault();

    const name = document.getElementById('reg-subject-name').value;
    const categorySelect = document.getElementById('reg-category');
    const category = categorySelect.options[categorySelect.selectedIndex].value;
    const schedule = document.getElementById('reg-schedule').value;
    const capacity = parseInt(document.getElementById('reg-capacity').value);

    // Generar un ID para la materia
    const subjectId = 'sub_' + Date.now();
    state.subjectsCatalogue.push({
        id: subjectId,
        name: name,
        category: category
    });

    const globalSubId = 'tutor_' + Date.now();
    state.tutors.push({
        id: globalSubId,
        name: 'Asesor TecNM',
        subjectId: subjectId,
        schedule: schedule,
        slotsTotal: capacity,
        slotsAvailable: capacity,
        status: 'pending',
        classroom: ''
    });

    const newSubject = {
        id: 'tutor_sub_' + Date.now(),
        globalId: globalSubId, // Para correlacionar
        name: name,
        category: category,
        schedule: schedule,
        capacity: capacity,
        status: 'pending',
        classroom: ''
    };

    state.myTutorSubjects.push(newSubject);

    closeModal('modal-register-subject');
    showToast('Materia registrada con éxito', 'success');

    // Limpiar form
    document.getElementById('form-register').reset();

    initTutorPanel();
}

// Simulación de aceptar solicitud
window.approveRequest = function (reqId) {
    showToast('Solicitud aceptada, notificando al alumno...', 'success');
    // En una app real actualizaríamos el estado, re-renderizando la lista
}

/* =========================================================================
   LÓGICA DEL PANEL DE COORDINADOR
   ========================================================================= */
function initCoordinatorPanel() {
    if (state.currentUser !== 'coordinator') return;

    const tbody = document.getElementById('coord-proposals-body');
    const emptyState = document.getElementById('coord-empty-state');

    let pendingCount = 0;
    let approvedCount = state.tutors.filter(t => t.status === 'approved').length;

    tbody.innerHTML = '';

    const pendingProposals = state.tutors.filter(t => t.status === 'pending');

    if (pendingProposals.length === 0) {
        tbody.parentElement.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        tbody.parentElement.style.display = 'table';

        pendingProposals.forEach(proposal => {
            const tr = document.createElement('tr');
            pendingCount++;

            // Buscar nombre de la materia
            const subject = state.subjectsCatalogue.find(s => s.id === proposal.subjectId);
            const subjectName = subject ? subject.name : 'Materia Desconocida';

            tr.innerHTML = `
                <td><strong>${proposal.name}</strong></td>
                <td>${subjectName}</td>
                <td>${proposal.schedule}</td>
                <td>${proposal.slotsTotal}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="openApproveModal('${proposal.id}')">Asignar y Aprobar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    document.getElementById('coord-stat-pending').textContent = pendingCount;
    document.getElementById('coord-stat-approved').textContent = approvedCount;
}

function openApproveModal(tutorId) {
    const proposal = state.tutors.find(t => t.id === tutorId);
    if (!proposal) return;

    const subject = state.subjectsCatalogue.find(s => s.id === proposal.subjectId);

    document.getElementById('approve-subject-id').value = proposal.id;
    document.getElementById('approve-tutor-name').textContent = proposal.name;
    document.getElementById('approve-subject-name').textContent = subject ? subject.name : 'Desconocida';
    document.getElementById('approve-subject-schedule').textContent = proposal.schedule;
    document.getElementById('approve-subject-capacity').textContent = proposal.slotsTotal;

    // Poblar el select de salones disponibles
    const classroomSelect = document.getElementById('approve-classroom');
    classroomSelect.innerHTML = '<option value="">Selecciona un salón disponible...</option>';

    // Opcional: Podríamos filtrar salones que ya estén ocupados en ese horario
    // Por ahora mostramos todos
    state.classrooms.forEach(room => {
        const option = document.createElement('option');
        option.value = room;
        option.textContent = room;
        classroomSelect.appendChild(option);
    });

    openModal('modal-approve-subject');
}

function submitSubjectApproval(event) {
    event.preventDefault();

    const tutorId = document.getElementById('approve-subject-id').value;
    const classroom = document.getElementById('approve-classroom').value;

    const proposal = state.tutors.find(t => t.id === tutorId);
    if (proposal) {
        proposal.status = 'approved';
        proposal.classroom = classroom;

        // También actualizar en myTutorSubjects por si fue creada en esta sesión
        const localSub = state.myTutorSubjects.find(s => s.globalId === tutorId);
        if (localSub) {
            localSub.status = 'approved';
            localSub.classroom = classroom;
        }
    }

    closeModal('modal-approve-subject');
    showToast('Propuesta aprobada y salón asignado', 'success');
    initCoordinatorPanel();
}

function rejectSubject() {
    const tutorId = document.getElementById('approve-subject-id').value;
    const index = state.tutors.findIndex(t => t.id === tutorId);
    if (index > -1) {
        state.tutors.splice(index, 1);

        // También en local
        const localSub = state.myTutorSubjects.find(s => s.globalId === tutorId);
        if (localSub) {
            localSub.status = 'rejected';
        }
    }

    closeModal('modal-approve-subject');
    showToast('Propuesta rechazada', 'warning');
    initCoordinatorPanel();
}

/* =========================================================================
   CONTROL DE MODALES
   ========================================================================= */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        // Prevenir scroll en el body
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Cerrar modal al hacer clic afuera (overlay)
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
        document.body.style.overflow = '';
    }
});

/* =========================================================================
   SISTEMA DE TOASTS (Avisos)
   ========================================================================= */
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let iconClass = 'ph-info';
    if (type === 'success') iconClass = 'ph-check-circle';
    if (type === 'error') iconClass = 'ph-x-circle';
    if (type === 'warning') iconClass = 'ph-warning';

    toast.innerHTML = `
        <i class="ph-fill ${iconClass} toast-icon"></i>
        <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    // Auto remover después de 3.5 segundos
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s reverse forwards';
        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300);
    }, 3500);
}
