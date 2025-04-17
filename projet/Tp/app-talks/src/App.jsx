import { useState } from 'react';
import './App.css';
import {useStoreTalks} from "./store/useStoreTalks.js";

function App() {
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [presenter, setPresenter] = useState('');
    const [objective, setObjective] = useState('');
    const [duree, setDuree] = useState('');
    const [editingTalk, setEditingTalk] = useState(null);
    const [filterSubject, setFilterSubject] = useState('');
    const [showForm, setShowForm] = useState(false);

    const talks = useStoreTalks((state) => state.talks);
    const addTalk = useStoreTalks((state) => state.addTalk);
    const removeTalk = useStoreTalks((state) => state.removeTalk);
    const modifyTalk = useStoreTalks((state) => state.modifyTalk);
    const toggleTalk = useStoreTalks((state) => state.toggleTalk);
    const [sortOption, setSortOption] = useState('title');


    const handleSubmit = () => {
        if (!title.trim() || !subject.trim() || !presenter.trim() || !objective.trim() || !duree.trim()) {
            alert('Tous les champs sont obligatoires.');
            return;
        }

        addTalk({
            id: Date.now(),
            title: title.trim(),
            subject: subject.trim(),
            presenter: presenter.trim(),
            objective: objective.trim(),
            duree: duree.trim(),
            done: false,
        });

        setTitle('');
        setSubject('');
        setPresenter('');
        setObjective('');
        setDuree('');
        setShowForm(false);
    };

    const handleModify = () => {
        if ( !title.trim() || !subject.trim() || !presenter.trim() || !objective.trim() || !duree.trim()) {
            alert('Tous les champs sont obligatoires pour la modification.');
            return;
        }

        modifyTalk(editingTalk.id, {
            title: title.trim(),
            subject: subject.trim(),
            presenter: presenter.trim(),
            objective: objective.trim(),
            duree: duree.trim(),
        });

        setEditingTalk(null);
        setTitle('');
        setSubject('');
        setPresenter('');
        setObjective('');
        setDuree('');
        setShowForm(false);
    };

    const startEditing = (talk) => {
        setEditingTalk(talk);
        setTitle(talk.title);
        setSubject(talk.subject);
        setPresenter(talk.presenter);
        setObjective(talk.objective);
        setDuree(talk.duree);
        setShowForm(true);
    };

    const cancelForm = () => {
        setEditingTalk(null);
        setTitle('');
        setSubject('');
        setPresenter('');
        setObjective('');
        setDuree('');
        setShowForm(false);
    };

    return (

        <div className={`app-container`}>
            <header className="app-header">
                <h1 className="logo">
                    <span className="logo-icon">📅</span> Conférences
                </h1>
                <button
                    className="add-button m-4"
                    onClick={() => setShowForm(true)}
                >
                    Nouvelle conférence
                </button>
            </header>

            {showForm && (
                <div className="fullscreen-form">
                    <div className="form-overlay">
                        <div className="form-container">
                            <div className="form-header">
                                <h2>{editingTalk ? 'Modifier une conférence' : 'Ajouter une conférence'}</h2>
                                <button className="close-button" onClick={cancelForm}>×</button>
                            </div>

                            <div className="form-content">
                                <div className="form-row">

                                    <div className="input-group">
                                        <label htmlFor="presenter">Présentateur</label>
                                        <input
                                            id="presenter"
                                            type="text"
                                            value={presenter}
                                            onChange={(e) => setPresenter(e.target.value)}
                                            placeholder="Nom du présentateur"
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="input-group full-width">
                                        <label htmlFor="title">Titre</label>
                                        <input
                                            id="title"
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Titre de la conférence"
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="input-group">
                                        <label htmlFor="subject">Sujet</label>
                                        <input
                                            id="subject"
                                            type="text"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            placeholder="Sujet principal"
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="duree">Durée (min)</label>
                                        <input
                                            id="duree"
                                            type="number"
                                            value={duree}
                                            onChange={(e) => setDuree(e.target.value)}
                                            placeholder="Durée en minutes"
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="input-group full-width">
                                        <label htmlFor="objective">Objectif</label>
                                        <textarea
                                            id="objective"
                                            value={objective}
                                            onChange={(e) => setObjective(e.target.value)}
                                            placeholder="Objectif principal de la conférence"
                                            rows="3"
                                        />
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button
                                        className={`submit-button ${editingTalk ? 'edit-mode' : ''}`}
                                        onClick={editingTalk ? handleModify : handleSubmit}
                                    >
                                        {editingTalk ? 'Mettre à jour' : 'Ajouter'}
                                    </button>

                                    <button
                                        className="cancel-button"
                                        onClick={cancelForm}
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Liste des conférences */}
            <div className="content-area">
                <div className="search-filter">
                    <div className="sort-options pe-2">
                        <label htmlFor="sort-select">Trier par : </label>
                        <select
                            id="sort-select"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="default">Ordre d'ajout</option>
                            <option value="title">Titre (A-Z)</option>
                            <option value="duree">Durée (croissante)</option>
                        </select>
                    </div>

                </div>

                <div className="talks-grid">
                    {talks
                        .filter(talk => talk.subject.toLowerCase().includes(filterSubject.toLowerCase()))
                        .sort((a, b) => {
                            if (sortOption === 'title') {
                                return a.title.localeCompare(b.title);
                            } else if (sortOption === 'duree') {
                                return parseInt(a.duree) - parseInt(b.duree);
                            } else if (sortOption === 'default') {
                                return a.id - b.id;
                            }
                            return 0;
                        })
                        .map((talk) => (
                            <div
                                key={talk.id}
                                className={`talk-card ${talk.done ? 'talk-done' : ''}`}
                            >
                                <div className="talk-header">
                                    <h3>{talk.title}</h3>
                                    <span className="talk-duration">{talk.duree} min</span>
                                </div>

                                <div className="talk-content">

                                    <div className="talk-info-row">
                                        <span className="info-label">Sujet:</span>
                                        <span className="info-value">{talk.subject}</span>
                                    </div>

                                    <div className="talk-info-row">
                                        <span className="info-label">Présentateur:</span>
                                        <span className="info-value">{talk.presenter}</span>
                                    </div>

                                    <div className="talk-info-row">
                                        <span className="info-label">Objectif:</span>
                                        <span className="info-value">{talk.objective}</span>
                                    </div>
                                </div>

                                <div className="talk-actions">
                                    <button
                                        className={`action-btn status-btn ${talk.done ? 'done' : ''}`}
                                        onClick={() => toggleTalk(talk.id)}
                                    >
                                        {talk.done ? 'Terminé' : 'Marquer comme terminé'}
                                    </button>

                                    <div className="action-buttons">
                                        <button
                                            className="action-btn edit-btn"
                                            onClick={() => startEditing(talk)}
                                            disabled={talk.done}
                                        >
                                            Modifier
                                        </button>

                                        <button
                                            className="action-btn delete-btn"
                                            onClick={() => removeTalk(talk.id)}
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}

export default App;