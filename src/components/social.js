export default function Social() {
    //const dummy_footer = "Footer du Portfolio"

    return (
        <nav>
            <ul className="navbar social">
                {/* <li className="button-nav"><i className="fa-brands fa-x-twitter"></i></li> */}
                <li className="button-nav"><a href="https://www.linkedin.com/in/florent-ducret/" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-linkedin"></i></a></li>
                <li className="button-nav"><a href="https://github.com/Olfdev" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-github"></i></a></li>
            </ul>
        </nav>
    )
}