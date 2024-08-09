import './HomePage.scss'
import SearchBar from '../../components/SearchBar/SearchBar.jsx'
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';

function HomePage() {
  const {currentUser} = useContext(AuthContext)
  console.log(currentUser);
  
  return ( 
    <div className="HomePage">
      <div className="textContainer">
        <div className="wrapper">
          <h1 className='title'>
            Find Real Estate & Get Your Dream Place
          </h1>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aut voluptatem minus repellendus dolor. Maiores tenetur quibusdam dignissimos, nisi atque vel quos explicabo quia reprehenderit debitis a necessitatibus labore repudiandae.
          </p>
          <SearchBar />
          <div className="boxes">
            <div className="box">
              <h1>16+</h1>
              <h2>Years of Experience</h2>
            </div>
            <div className="box">
              <h1>200</h1>
              <h2>Award Gained</h2>
            </div>
            <div className="box">
              <h1>2000+</h1>
              <h2>Property Ready</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="imageContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  )
}

export default HomePage