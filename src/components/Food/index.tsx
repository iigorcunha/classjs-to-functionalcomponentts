import { FC, useEffect, useState } from 'react';
import { FiEdit3, FiTrash } from 'react-icons/fi';

import { Container } from './styles';
import api from '../../services/api';
import { IFood } from '../../pages/Dashboard';

interface FoodProps {
  food: IFood;
  handleEditFood: (food: IFood) => void;
  handleDelete: (id: number) => void;
}

const Food: FC<FoodProps> = ({food, handleEditFood, handleDelete}) => {

  const [available, setAvailable] = useState(false);


  useEffect(() => {
    setAvailable(food.available);
  }, [food.available])

  async function toggleAvailable (food: IFood) {

    await api.put(`/foods/${food.id}`, {
      ...food,
      available: !available,
    });

    setAvailable(!available);
  }

  function setEditingFood () {
    handleEditFood(food);
  }


    return (
      <Container available={food.available}>
        <header>
          <img src={food.image} alt={food.name} />
        </header>
        <section className="body">
          <h2>{food.name}</h2>
          <p>{food.description}</p>
          <p className="price">
            R$ <b>{food.price}</b>
          </p>
        </section>
        <section className="footer">
          <div className="icon-container">
            <button
              type="button"
              className="icon"
              onClick={setEditingFood}
              data-testid={`edit-food-${food.id}`}
            >
              <FiEdit3 size={20} />
            </button>

            <button
              type="button"
              className="icon"
              onClick={() => handleDelete(food.id)}
              data-testid={`remove-food-${food.id}`}
            >
              <FiTrash size={20} />
            </button>
          </div>

          <div className="availability-container">
            <p>{available ? 'Disponível' : 'Indisponível'}</p>

            <label htmlFor={`available-switch-${food.id}`} className="switch">
              <input
                id={`available-switch-${food.id}`}
                type="checkbox"
                checked={available}
                onChange={() => toggleAvailable(food)}
                data-testid={`change-status-food-${food.id}`}
              />
              <span className="slider" />
            </label>
          </div>
        </section>
      </Container>
    );
  };

export default Food;
