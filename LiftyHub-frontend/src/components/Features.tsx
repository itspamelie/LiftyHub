export default function Features() {
  return (
    <section className="features-section py-5">

      <div className="container">

        {/* TITULO */}

        <div className="row align-items-end mb-5">

          <div className="col-lg-7">

            <p className="text-primary fw-bold small-title">
              PREMIUM EXPERIENCE
            </p>

            <h2 className="fw-bold display-6 text-light">
              Engineered for performance,<br/>
              designed for results.
            </h2>

          </div>

          <div className="col-lg-5">

            <p className="text-secondary fs-5">
              Everything you need to reach your peak
              performance in one sleek, intuitive interface.
            </p>

          </div>

        </div>


        {/* CARDS */}

        <div className="row g-4">

          <div className="col-md-4">
            <div className="feature-card p-4 h-100">

              <div className="icon-box mb-4">
                📊
              </div>

              <h5 className="fw-bold text-light">
                Workout Tracking
              </h5>

              <p className="text-secondary">
                Log every set and rep with ease using
                our rapid-entry interface designed
                for heavy lifters.
              </p>

            </div>
          </div>


          <div className="col-md-4">
            <div className="feature-card p-4 h-100">

              <div className="icon-box mb-4">
                📋
              </div>

              <h5 className="fw-bold text-light">
                Custom Training Plans
              </h5>

              <p className="text-secondary">
                Get personalized routines tailored
                to your specific fitness goals.
              </p>

            </div>
          </div>


          <div className="col-md-4">
            <div className="feature-card p-4 h-100">

              <div className="icon-box mb-4">
                📈
              </div>

              <h5 className="fw-bold text-light">
                Progress Analytics
              </h5>

              <p className="text-secondary">
                Visualize your gains with deep-dive
                analytics and automatic PR tracking.
              </p>

            </div>
          </div>

        </div>

      </div>

    </section>
  )
}