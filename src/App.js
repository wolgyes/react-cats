import {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [cats, setCats] = useState([]);
    const [newCat, setNewCat] = useState({name: '', breed: '', age: 0});
    const [editingCat, setEditingCat] = useState(null);

    useEffect(() => {
        const fetchCats = async () => {
            const res = await fetch('http://localhost:8000/cats');
            const data = await res.json();
            setCats(data);
        };
        fetchCats();
    }, []);

    const handleNewCatChange = (e) => {
        setNewCat({...newCat, [e.target.name]: e.target.value});
    };

    const handleEditCatChange = (e) => {
        setEditingCat({...editingCat, [e.target.name]: e.target.value});
    };

    const handleNewCatSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:8000/cats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCat),
        });
        const data = await res.json();
        setCats([...cats, data]);
        setNewCat({name: '', breed: '', age: 0});
    };

    const handleEditCatSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch(`http://localhost:8000/cats/${editingCat.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editingCat),
        });
        const data = await res.json();
        setCats(
            cats.map((cat) => (cat.id === data.id ? {...cat, ...data} : cat))
        );
        setEditingCat(null);
    };

    const handleDeleteCat = async (catId) => {
        await fetch(`http://localhost:8000/cats/${catId}`, {
            method: 'DELETE',
        });
        setCats(cats.filter((cat) => cat.id !== catId));
    };

    return (
        <div className="container">
            <h1 className="mb-4">Cats</h1>
            <ul className="list-group">
                {cats.map((cat) => (
                    <li key={cat.id} className="list-group-item d-flex justify-content-between align-items-center">
                        {editingCat && editingCat.id === cat.id ? (
                            <form onSubmit={handleEditCatSubmit}>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="name"
                                        value={editingCat.name}
                                        onChange={handleEditCatChange}
                                        className="form-control mb-2"
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="breed"
                                        value={editingCat.breed}
                                        onChange={handleEditCatChange}
                                        className="form-control mb-2"
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="number"
                                        name="age"
                                        value={editingCat.age}
                                        onChange={handleEditCatChange}
                                        className="form-control mb-2"
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary mr-2">Save</button>
                                <button type="button" onClick={() => setEditingCat(null)} className="btn btn-secondary">Cancel</button>
                            </form>
                        ) : (
                            <>
                                <div>
                                    {cat.name} ({cat.breed}, {cat.age} years old)
                                </div>
                                <div>
                                    <button type="button" onClick={() => setEditingCat(cat)} className="btn btn-warning mr-2">
                                        Edit
                                    </button>
                                    <button type="button" onClick={() => handleDeleteCat(cat.id)} className="btn btn-danger">
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
            <form onSubmit={handleNewCatSubmit} className="mt-4">
                <div className="form-group">
                    <input
                        type="text"
                        name="name"
                        value={newCat.name}
                        onChange={handleNewCatChange}
                        className="form-control mb-2"
                        placeholder="Name"
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="breed"
                        value={newCat.breed}
                        onChange={handleNewCatChange}
                        className="form-control mb-2"
                        placeholder="Breed"
                    />
                </div>
                <div className="form-group">
                    <input
                        type="number"
                        name="age"
                        value={newCat.age}
                        onChange={handleNewCatChange}
                        className="form-control mb-2"
                        placeholder="Age"
                    />
                </div>
                <button type="submit" className="btn btn-success">Create</button>
            </form>
        </div>
    );
}

export default App;

