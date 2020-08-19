export interface State {
    nextId: number,
    meals: Array<Meal>,
    form: MealForm,
}

export interface Meal {
    id: number,
    description: string,
    calories: number,
}

export interface MealForm {
    description: string,
    calories: number,
    showForm: boolean,
    editId: number | null,
}

const initModel: State = {
    nextId: 0,
    meals: [],
    form: {
        description: 'Breakfast',
        calories: 480,
        showForm: false,
        editId: null,
    },
};

export default initModel;
