import "../styles/dashboard.css"
import logo from "../assets/img/logo-ct.png"

const Dashboard = () => {
  return (
    <>
      <aside
        className="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3"
        id="sidenav-main"
      >
        <div className="sidenav-header">
          <i
            className="fas fa-times p-3 cursor-pointer text-secondary opacity-5 position-absolute end-0 top-0 d-none d-xl-none"
            aria-hidden="true"
            id="iconSidenav"
          ></i>

          <a
            className="navbar-brand m-0"
            href="https://demos.creative-tim.com/soft-ui-dashboard/pages/dashboard.html"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={logo}
              className="navbar-brand-img h-100"
              alt="main_logo"
            />

            <span className="ms-1 font-weight-bold">
              Soft UI Dashboard
            </span>
          </a>
        </div>

        <hr className="horizontal dark mt-0" />

        <div
          className="collapse navbar-collapse w-auto max-height-vh-100 h-100"
          id="sidenav-collapse-main"
        >
          <ul className="navbar-nav">

            <li className="nav-item">
              <a className="nav-link active" href="#">
                <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                  <svg
                    width="12px"
                    height="12px"
                    viewBox="0 0 45 40"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>shop</title>
                    <path
                      fill="#fff"
                      d="M46.7 10.7L40.8 0.94C40.49 0.36 39.85 0 39.16 0H7.83C7.14 0 6.50 0.36 6.15 0.94L0.28 10.74C0.09 11.04 0 11.39 0 11.75C0 16.06 3.48 19.57 7.80 19.58C9.75 19.58 11.61 18.87 13.05 17.57C16.01 20.25 20.52 20.25 23.49 17.57C26.46 20.26 30.97 20.26 33.94 17.57C36.24 19.64 39.54 20.17 42.36 18.91C45.19 17.64 47 14.84 47 11.75C47 11.39 46.90 11.04 46.71 10.74Z"
                    />
                  </svg>
                </div>

                <span className="nav-link-text ms-1">
                  Dashboard
                </span>
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#">
                <span className="nav-link-text ms-1">
                  Tables
                </span>
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#">
                <span className="nav-link-text ms-1">
                  Billing
                </span>
              </a>
            </li>

          </ul>
        </div>
      </aside>

      <main className="main-content position-relative max-height-vh-100 h-100 mt-1 border-radius-lg">

        <nav
          className="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl"
          id="navbarBlur"
        >
          <div className="container-fluid py-1 px-3">

            <h6 className="font-weight-bolder mb-0">
              Dashboard
            </h6>

            <div className="ms-md-auto pe-md-3 d-flex align-items-center">
              <div className="input-group">

                <span className="input-group-text text-body">
                  <i className="fas fa-search"></i>
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Type here..."
                />

              </div>
            </div>

          </div>
        </nav>

      </main>
    </>
  )
}

export default Dashboard