
import { useState } from "react";
import { useEffect } from "react";
import { Nutrition } from "./Nutrition";
import { LoaderPage } from "./LoaderPage";
import video from './food.mp4';
import Swal from "sweetalert2";
import './App.css'

function App() {

  const [mySearch, setMySearch] = useState('');
  const [wordSubmitted, setWordSubmitted] = useState('');
  const [myNutrition, setMyNutrition] = useState('');
  const [stateLoader, setStateLoader] = useState(false);

  const APP_ID = 'b2d0a811';
  const APP_KEY = '6fd1196675fb0b47e833bb3bde31e493';
  const APP_URL = 'https://api.edamam.com/api/nutrition-details'

  const fetchData = async (ingr) => {
    setStateLoader(true); // Страница начинает грузить информацию, Loader активный

    const response = await fetch(`${APP_URL}?app_id=${APP_ID}&app_key=${APP_KEY}`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }, // два заголовка запроса
      body: JSON.stringify({ ingr: ingr }) // тело запроса
      // параметры fetch(url, [options])
    })

    if(response.ok) {
      setStateLoader(false); //убрать загрузку
      const data = await response.json();
      
      setMyNutrition(data);
      // если логическое значение true, т.е запрос прошел успешно и код статуса https 200-299, то покажи полученные данные API
    } else {
      setStateLoader(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ingredients entered incorrectly!",
        
      }); // в противном случае предупреждение
    }
  }

  const myRecipeSearch = e => {
    setMySearch(e.target.value); //изменение состояния поля ввода (отражаем то что вводит пользователь)
  }

  const finalSearch = e => {
    e.preventDefault();
    setWordSubmitted(mySearch); //обновленное состояние прикрепленного значения (то что написано в поле ввода)
  }

  useEffect(() => {
    if (wordSubmitted !== '') {//если отправляемое слово существует (поле ввода не пустое)
      let ingr = wordSubmitted.split(/[,,;,\n,\r]/); //метод сплит (разделение строки на массив элементов) плюс регулярное выражение (возможный набор запятых на клавише)
      fetchData(ingr); //вызов функции запроса API
    }
  }, [wordSubmitted]) //меняется запрашиваемое слово


  return (
    <div className="block">
      {stateLoader && <LoaderPage />}

      <div className="container">
      <video autoPlay muted loop>
        <source src={video} type="video/mp4"/>
      </video>

      <h1>Nutrition Analysis</h1>
      </div>
      <form className="container" onSubmit={finalSearch}>
        <input className="search"
          placeholder="Enter ingredients..."
          onChange={myRecipeSearch}
        />
      </form>
      <div className="container">
      <button type="submit" onClick={finalSearch}>Search</button>
      </div>
      <div className="nutrition">
        {
          myNutrition && <p className="calories"><b>{myNutrition.calories} kcal</b></p> // отражаем калории (см. console)
        }
        {
          myNutrition && Object.values(myNutrition.totalNutrients) // Значения массива объекта (label, quantity, unit) см.console
            .map(({ label, quantity, unit }, index) =>
              <Nutrition
                key={index}
                label={label}
                quantity={quantity}
                unit={unit}
              />
            )
        }
      </div>
    </div>
  );
}

export default App;
