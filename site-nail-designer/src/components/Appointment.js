import React, { useState, useEffect } from 'react';

function Appointment() {
    const [formData, setFormData] = useState({
        nome: '',
        telefone: '',
        data: '',
        hora: '',
        servico: ''
    });
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableHours, setAvailableHours] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [showHoursContainer, setShowHoursContainer] = useState(false);

    const services = [
        "Fibra de vidro",
        "Molde F1",
        "Banho em gel",
        "Manutenção",
        "Esmaltação em gel"
    ];

    const workingHours = [
        "08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"
    ];

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = () => {
        const saved = localStorage.getItem('agendamentos');
        if (saved) {
            setAppointments(JSON.parse(saved));
        }
    };

    const saveAppointments = (newAppointments) => {
        localStorage.setItem('agendamentos', JSON.stringify(newAppointments));
        setAppointments(newAppointments);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        const dateStr = date.toISOString().split('T')[0];
        setFormData(prev => ({ ...prev, data: dateStr }));

        // Filtrar horários disponíveis
        const bookedHours = appointments
            .filter(apt => apt.data === dateStr)
            .map(apt => apt.hora);

        const available = workingHours.filter(hour => !bookedHours.includes(hour));
        setAvailableHours(available);
        setShowHoursContainer(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedDate) {
            alert('Por favor, selecione uma data primeiro.');
            return;
        }

        const newAppointment = {
            id: Date.now(),
            ...formData,
            data: selectedDate.toISOString().split('T')[0]
        };

        const updatedAppointments = [...appointments, newAppointment];
        saveAppointments(updatedAppointments);

        // Limpar formulário
        setFormData({
            nome: '',
            telefone: '',
            data: '',
            hora: '',
            servico: ''
        });
        setSelectedDate(null);
        setAvailableHours([]);
        setShowHoursContainer(false);

        alert('Agendamento realizado com sucesso!');
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const days = [];

        // Adicionar dias vazios no início
        for (let i = 0; i < startingDay; i++) {
            days.push(null);
        }

        // Adicionar dias do mês
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const isDateBooked = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        return appointments.some(apt => apt.data === dateStr);
    };

    const isDateSelected = (date) => {
        return selectedDate &&
            date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear();
    };

    const isDateToday = (date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const isDatePast = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const changeMonth = (direction) => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(prev.getMonth() + direction);
            return newMonth;
        });
    };

    const monthNames = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const days = getDaysInMonth(currentMonth);

    return (
        <section id="agendamento" className="main-agendamento">
            <h2 className="titulo-agendamento">Agendamento Online</h2>
            <p>
                Escolha o melhor dia e horário para seu atendimento. Preencha os dados abaixo para agendar
                automaticamente:
            </p>

            <form onSubmit={handleSubmit} className="form-agendamento">
                <label htmlFor="nome-agendamento">Nome:</label>
                <input
                    type="text"
                    id="nome-agendamento"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    required
                />

                <label htmlFor="telefone-agendamento">Telefone/WhatsApp:</label>
                <input
                    type="tel"
                    id="telefone-agendamento"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    required
                    pattern="[0-9]{10,13}"
                />

                <label htmlFor="data-agendamento">
                    Data selecionada: <span id="data-selecionada-texto">
                        {selectedDate ? selectedDate.toLocaleDateString('pt-BR') : 'Nenhuma data selecionada'}
                    </span>
                </label>

                {showHoursContainer && (
                    <div
                        id="horarios-disponiveis-container"
                        style={{
                            display: 'block',
                            margin: '15px 0',
                            padding: '15px',
                            background: '#f8f9fa',
                            borderRadius: '8px',
                            borderLeft: '4px solid #007bff'
                        }}
                    >
                        <h4 style={{ margin: '0 0 10px 0', color: '#007bff' }}>Horários Disponíveis</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {availableHours.map(hour => (
                                <button
                                    key={hour}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, hora: hour }))}
                                    style={{
                                        padding: '5px 10px',
                                        border: formData.hora === hour ? '2px solid #007bff' : '1px solid #ddd',
                                        borderRadius: '5px',
                                        background: formData.hora === hour ? '#007bff' : 'white',
                                        color: formData.hora === hour ? 'white' : 'black',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {hour}
                                </button>
                            ))}
                        </div>
                        <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#666' }}>
                            <strong>Total:</strong> {availableHours.length} horários disponíveis
                        </p>
                    </div>
                )}

                <label htmlFor="hora-agendamento">Horário:</label>
                <select
                    id="hora-agendamento"
                    name="hora"
                    value={formData.hora}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Selecione uma data primeiro</option>
                    {availableHours.map(hour => (
                        <option key={hour} value={hour}>{hour}</option>
                    ))}
                </select>

                <label htmlFor="servico-agendamento">Serviço:</label>
                <select
                    id="servico-agendamento"
                    name="servico"
                    value={formData.servico}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Selecione</option>
                    {services.map(service => (
                        <option key={service} value={service}>{service}</option>
                    ))}
                </select>

                <button type="submit">Agendar</button>
            </form>

            <div id="calendario-agendamentos" className="calendario-agendamentos">
                <h3>Calendário de Agendamentos</h3>
                <div className="calendario-container">
                    <div className="calendario-header">
                        <button
                            type="button"
                            onClick={() => changeMonth(-1)}
                            className="btn-mes"
                        >
                            &lt;
                        </button>
                        <h4>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h4>
                        <button
                            type="button"
                            onClick={() => changeMonth(1)}
                            className="btn-mes"
                        >
                            &gt;
                        </button>
                    </div>

                    <div className="calendario-dias">
                        <div className="dia-semana">Dom</div>
                        <div className="dia-semana">Seg</div>
                        <div className="dia-semana">Ter</div>
                        <div className="dia-semana">Qua</div>
                        <div className="dia-semana">Qui</div>
                        <div className="dia-semana">Sex</div>
                        <div className="dia-semana">Sáb</div>
                    </div>

                    <div className="dias-calendario">
                        {days.map((day, index) => (
                            <div
                                key={index}
                                className={`dia-calendario ${!day ? 'dia-vazio' :
                                        isDatePast(day) ? 'dia-passado' :
                                            isDateToday(day) ? 'dia-hoje' :
                                                isDateSelected(day) ? 'dia-selecionado' :
                                                    isDateBooked(day) ? 'dia-ocupado' : ''
                                    }`}
                                onClick={() => day && !isDatePast(day) && handleDateSelect(day)}
                                style={{
                                    cursor: day && !isDatePast(day) ? 'pointer' : 'default'
                                }}
                            >
                                {day ? day.getDate() : ''}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="agendamentos-lista">
                    <h4>Agendamentos Salvos</h4>
                    <ul>
                        {appointments.map(appointment => (
                            <li key={appointment.id}>
                                <strong>{appointment.nome}</strong> - {appointment.data} às {appointment.hora}
                                ({appointment.servico})
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}

export default Appointment; 