import React, { useState, useRef } from 'react';
import { Plus, Minus, Copy, Edit2, Check, X } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface Meal {
  item: string;
  quantity: string;
}

interface Category {
  id: string;
  title: string;
  meals: Meal[];
}

const MealBlock: React.FC<{
  title: string;
  meals: Meal[];
  setMeals: (meals: Meal[]) => void;
  options: string[];
  onRemove: () => void;
  onRename: (newTitle: string) => void;
}> = ({ title, meals, setMeals, options, onRemove, onRename }) => {
  const [newItem, setNewItem] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [isCustom, setIsCustom] = useState(false);

  const addMeal = () => {
    if (newItem && newQuantity) {
      setMeals([...meals, { item: newItem, quantity: newQuantity }]);
      setNewItem('');
      setNewQuantity('');
      setIsCustom(false);
    }
  };

  const handleRename = () => {
    onRename(editedTitle);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        {isEditing ? (
          <div className="flex items-center">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="border rounded px-2 py-1 mr-2"
            />
            <button onClick={handleRename} className="text-green-500 mr-2">
              <Check size={16} />
            </button>
            <button onClick={() => setIsEditing(false)} className="text-red-500">
              <X size={16} />
            </button>
          </div>
        ) : (
          <h2 className="text-xl font-semibold">{title}</h2>
        )}
        <div>
          <button onClick={() => setIsEditing(true)} className="text-blue-500 mr-2">
            <Edit2 size={16} />
          </button>
          <button onClick={onRemove} className="text-red-500">
            <Minus size={16} />
          </button>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        {meals.map((meal, index) => (
          <div key={index} className="flex justify-between items-center">
            <span>{meal.item}</span>
            <span>{meal.quantity}</span>
          </div>
        ))}
      </div>
      <div className="flex space-x-2 mb-2">
        {isCustom ? (
          <input
            className="border rounded px-2 py-1 flex-grow"
            placeholder="Custom ingredient"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
        ) : (
          <select
            className="border rounded px-2 py-1 flex-grow"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          >
            <option value="">Select item</option>
            {options.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        )}
        <input
          className="border rounded px-2 py-1 w-24"
          placeholder="Quantity"
          value={newQuantity}
          onChange={(e) => setNewQuantity(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={addMeal}
        >
          <Plus size={16} />
        </button>
      </div>
      <button
        className="text-blue-500 underline"
        onClick={() => setIsCustom(!isCustom)}
      >
        {isCustom ? "Use predefined options" : "Add custom ingredient"}
      </button>
    </div>
  );
};

const MealPlanDashboard: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([
    { id: 'breakfast', title: 'Petit Déjeuner', meals: [] },
    { id: 'lunch', title: 'Déjeuner', meals: [] },
    { id: 'dinner', title: 'Dîner', meals: [] },
  ]);
  const [snacks, setSnacks] = useState<Meal[]>([]);
  const [supplements, setSupplements] = useState<Meal[]>([]);
  const [exportMessage, setExportMessage] = useState('');

  const mainMealOptions = ['Légumes', 'Viande maigre', 'Riz', 'Boulgour', 'Pâtes complètes', 'Couscous complet', 'Pomme de terre', 'Patate douce', 'Huile d\'olive'];
  const snackOptions = ['Banane', 'Datte', 'Noix', 'Raisins secs', 'Yaourt Nature', 'Miel', 'WHEY', 'Fruit (Orange, Pomme, Abricot, Pêche, Fraise, Pastèque, Melon)', 'Pain complet', 'Oeuf', 'Flocons d\'avoine', 'Amande', 'Fromage frais', 'Pancake', 'Boules d\'énergie', 'Chocolat noir 70%'];
  const supplementOptions = ['Amino énergie', 'L-carnitine', 'Créatine', 'Beta Alanine', 'MSM', 'Collagène marin', 'Électrolyte', 'Caféine', 'Oméga 3', 'Ashwagandha', 'Mélatonine'];

  const addCategory = () => {
    const newId = `category-${Date.now()}`;
    const newTitle = `Nouveau Repas`;
    setCategories([...categories, { id: newId, title: newTitle, meals: [] }]);
  };

  const removeCategory = (id: string) => {
    setCategories(categories.filter(category => category.id !== id));
  };

  const renameCategory = (id: string, newTitle: string) => {
    setCategories(categories.map(category =>
      category.id === id ? { ...category, title: newTitle } : category
    ));
  };

  const updateCategoryMeals = (id: string, newMeals: Meal[]) => {
    setCategories(categories.map(category => 
      category.id === id ? { ...category, meals: newMeals } : category
    ));
  };

  const workspaceRef = useRef<HTMLDivElement>(null);

  const generatePDFContent = () => {
    const content = document.createElement('div');
    content.style.width = '800px';
    content.style.padding = '40px';
    content.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    content.style.color = '#1d1d1f';
    content.style.background = '#ffffff';

    const title = document.createElement('h1');
    title.textContent = 'Plan de Nutrition';
    title.style.fontSize = '48px';
    title.style.fontWeight = '700';
    title.style.textAlign = 'center';
    title.style.marginBottom = '40px';
    title.style.color = '#1d1d1f';
    content.appendChild(title);

    const allCategories = [...categories, { id: 'snacks', title: 'Collations', meals: snacks }, { id: 'supplements', title: 'Suppléments', meals: supplements }];

    allCategories.forEach((category, index) => {
      if (category.meals.length > 0) {
        const categorySection = document.createElement('div');
        categorySection.style.marginBottom = '40px';
        categorySection.style.opacity = '0';
        categorySection.style.transform = 'translateY(20px)';
        categorySection.style.animation = `fadeIn 0.5s ease-out ${index * 0.1}s forwards`;

        const categoryTitle = document.createElement('h2');
        categoryTitle.textContent = category.title;
        categoryTitle.style.fontSize = '36px';
        categoryTitle.style.fontWeight = '600';
        categoryTitle.style.marginBottom = '20px';
        categoryTitle.style.color = '#1d1d1f';
        categorySection.appendChild(categoryTitle);

        const mealList = document.createElement('ul');
        mealList.style.listStyleType = 'none';
        mealList.style.padding = '0';

        category.meals.forEach((meal, mealIndex) => {
          const mealItem = document.createElement('li');
          mealItem.style.display = 'flex';
          mealItem.style.justifyContent = 'space-between';
          mealItem.style.alignItems = 'center';
          mealItem.style.padding = '15px 0';
          mealItem.style.borderBottom = '1px solid #d2d2d7';
          mealItem.style.opacity = '0';
          mealItem.style.transform = 'translateX(-20px)';
          mealItem.style.animation = `slideIn 0.5s ease-out ${index * 0.1 + mealIndex * 0.05}s forwards`;

          const itemName = document.createElement('span');
          itemName.textContent = meal.item;
          itemName.style.fontSize = '18px';
          itemName.style.fontWeight = '400';

          const itemQuantity = document.createElement('span');
          itemQuantity.textContent = meal.quantity;
          itemQuantity.style.fontSize = '18px';
          itemQuantity.style.fontWeight = '600';
          itemQuantity.style.color = '#06c';

          mealItem.appendChild(itemName);
          mealItem.appendChild(itemQuantity);
          mealList.appendChild(mealItem);
        });

        categorySection.appendChild(mealList);
        content.appendChild(categorySection);
      }
    });

    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes slideIn {
        to { opacity: 1; transform: translateX(0); }
      }
    `;
    content.appendChild(style);

    return content;
  };

  const exportToPDF = () => {
    const content = generatePDFContent();
    document.body.appendChild(content);

    setTimeout(() => {
      html2canvas(content, { scale: 2 }).then((canvas) => {
        document.body.removeChild(content);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width / 2;
        const imgHeight = canvas.height / 2;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 10;
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        pdf.save('plan_de_nutrition.pdf');
      });
    }, 1000); // Wait for animations to complete
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Nutrition</h1>
        <div>
          <button
            onClick={exportToPDF}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            Exporter en PDF
          </button>
          <button
            onClick={() => {
              const summary = categories.map(cat => `${cat.title}: ${cat.meals.length} items`).join('\n');
              navigator.clipboard.writeText(summary);
              setExportMessage('Résumé copié');
              setTimeout(() => setExportMessage(''), 3000);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
          >
            <Copy size={16} className="mr-2" />
            Copier le résumé
          </button>
        </div>
      </div>
      {exportMessage && <p className="text-green-500 mb-4">{exportMessage}</p>}
      
      <button
        onClick={addCategory}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        <Plus size={16} className="inline mr-2" />
        Ajouter une catégorie de repas
      </button>

      <div ref={workspaceRef} className="space-y-4">
        {categories.map(category => (
          <MealBlock 
            key={category.id}
            title={category.title}
            meals={category.meals}
            setMeals={(newMeals) => updateCategoryMeals(category.id, newMeals)}
            options={mainMealOptions}
            onRemove={() => removeCategory(category.id)}
            onRename={(newTitle) => renameCategory(category.id, newTitle)}
          />
        ))}
        
        <MealBlock 
          title="Collations" 
          meals={snacks} 
          setMeals={setSnacks} 
          options={snackOptions}
          onRemove={() => {}} 
          onRename={() => {}}
        />
        <MealBlock 
          title="Suppléments" 
          meals={supplements} 
          setMeals={setSupplements} 
          options={supplementOptions}
          onRemove={() => {}} 
          onRename={() => {}}
        />
      </div>
    </div>
  );
};

export default MealPlanDashboard;