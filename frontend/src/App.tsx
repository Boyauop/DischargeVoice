import './index.css'

const patientFeatures = [
  'View discharge summary and home-care instructions',
  'Review medications, schedules, and follow-up visits',
  'Ask DischargeVoice by text or voice with safety-first guidance',
  'Complete teach-back questions to confirm understanding',
]

const clinicianFeatures = [
  'Create structured discharge plans with medications and warnings',
  'Track teach-back responses and clarification needs',
  'Maintain role-based oversight and audit visibility',
]

function App() {
  return (
    <main className="page">
      <header className="hero card">
        <p className="eyebrow">DischargeVoice</p>
        <h1>From hospital discharge to safe recovery at home.</h1>
        <p>
          Understand your discharge plan, medications, follow-up care, and warning signs through
          simple text and voice assistance.
        </p>
        <p className="notice">
          DischargeVoice supports patient education. It does not replace clinicians or emergency
          services.
        </p>
      </header>

      <section className="grid" aria-label="How it works">
        <article className="card">
          <h2>Patient experience</h2>
          <ul>
            {patientFeatures.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </article>
        <article className="card">
          <h2>Healthcare professional workflow</h2>
          <ul>
            {clinicianFeatures.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="card">
        <h2>AI + voice safety</h2>
        <p>
          Assistant responses must stay grounded in the authorized discharge plan. If information is
          missing or unsafe to infer, patients are directed to a qualified healthcare professional.
        </p>
      </section>

      <section className="card">
        <h2>Future integration readiness</h2>
        <p>
          Architecture is organized to support future Alexa+ and MCP integration without exposing
          unauthorized patient data.
        </p>
      </section>
    </main>
  )
}

export default App
