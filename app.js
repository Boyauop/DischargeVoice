const patients = [
  { initials: 'EM', name: 'Elena Morales', detail: 'Room 418 · Heart failure', window: 'Today, 10:30 AM', status: 'Ready to discharge', statusClass: 'ready', score: '4 / 4', tone: '' },
  { initials: 'JO', name: 'James Okafor', detail: 'Room 421 · Post-op recovery', window: 'Today, 1:00 PM', status: 'Needs review', statusClass: 'review', score: '2 / 4', tone: 'peach' },
  { initials: 'SP', name: 'Samir Patel', detail: 'Room 405 · Pneumonia', window: 'Today, 2:30 PM', status: 'Ready to discharge', statusClass: 'ready', score: '4 / 4', tone: 'yellow' },
  { initials: 'LW', name: 'Lydia Wong', detail: 'Room 412 · Type 2 diabetes', window: 'Today, 4:00 PM', status: 'Plan in progress', statusClass: 'draft', score: '—', tone: 'peach' }
];

const rows = document.querySelector('#patientRows');
rows.innerHTML = patients.map((patient) => `
  <div class="patient-row">
    <div class="patient"><div class="patient-avatar ${patient.tone}">${patient.initials}</div><div><strong>${patient.name}</strong><span>${patient.detail}</span></div></div>
    <div class="window">${patient.window}</div>
    <div><span class="status ${patient.statusClass}">${patient.status}</span></div>
    <div class="score ${patient.score === '—' ? 'pending' : ''}">${patient.score}</div>
    <div class="row-menu">•••</div>
  </div>`).join('');

const toast = document.querySelector('#toast');
document.querySelector('#newPlanBtn').addEventListener('click', () => {
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2500);
});

document.querySelector('#filterBtn').addEventListener('click', (event) => {
  const button = event.currentTarget;
  button.firstChild.textContent = button.firstChild.textContent.trim() === 'All patients' ? 'Needs attention ' : 'All patients ';
  const showAttention = button.firstChild.textContent.trim() === 'Needs attention';
  document.querySelectorAll('.patient-row').forEach((row, index) => {
    row.hidden = showAttention && patients[index].statusClass !== 'review';
  });
});
