import { useEffect, useState } from 'react';

import { Header } from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

export interface IFood {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image: string;
}

const Dashboard: React.FC = () => {

  const [foods, setFoods] = useState<IFood[]>([]);
  const [editingFood, setEditingFood] = useState<IFood>();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);

  useEffect(() =>{
    async function loadFoods() {
      const response = await api.get('/foods');

      setFoods(response.data);
    }

    loadFoods();
  }, [])

  async function handleAddFood (food: IFood) {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood (food: IFood) {

    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood!.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood (id: number) {
    

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  function handleEditFood(food: IFood) {
    setEditingFood(food);
    setEditModalIsOpen(true);
  }

    return (
      <>
        <Header openModal={() => setModalIsOpen(!modalIsOpen)} />
        <ModalAddFood
          isOpen={modalIsOpen}
          setIsOpen={() => setModalIsOpen(!modalIsOpen)}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalIsOpen}
          setIsOpen={() => setEditModalIsOpen(!editModalIsOpen)}
          editingFood={editingFood!}
          handleUpdateFood={handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
    );
  };

export default Dashboard;
