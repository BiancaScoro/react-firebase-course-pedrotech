import './App.css';
import { Auth } from './components/auth';
import { db, auth, storage } from './config/firebase';
import { getDocs, collection, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import {useState, useEffect} from 'react';

function App() {
  const [movieList, setMovieList] = useState([]);
  // new movie states
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState("");
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(true);
// update title state
  const [updateTitle, setUpdateTitle] = useState("");
// File Upload State
const [fileUpload, setFileUpload] = useState(null);

  const moviesCollectionRef = collection(db, "movies");

  const getMovieList = async () => {
    //READ THE DATA
    //SET MOVIE LIST
    try {
    const data = await getDocs(moviesCollectionRef);
    const filteredData = data.docs.map((doc) => ({
      ...doc.data(),
       id: doc.id,
      }))
    setMovieList(filteredData);
    console.log({filteredData});
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getMovieList();
  }, []);

 const onSubmitMovie = async () => {
  try {
  await addDoc(moviesCollectionRef, {title: newMovieTitle, releaseDate: newReleaseDate, receivedAnOscar: isNewMovieOscar, userId: auth?.currentUser.uid })
  getMovieList();
  } catch (err) {
    console.error(err);
  }
 }

 const deleteMovie = async (id) => {
  const movieDoc = doc(db, "movies", id)
  await deleteDoc(movieDoc)
 }  
 const updateMovieTitle = async (id) => {
  const movieDoc = doc(db, "movies", id)
  await updateDoc(movieDoc, {title: updateTitle})
 }  
 const uploadFile = async () => {
  if (!fileUpload) return;
  const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
  try {
  await uploadBytes(filesFolderRef, fileUpload);
  } catch(err) {
    console.error(err);
  }
 }
 return (
    <div className="App">
      <Auth />
      <div>
        <input placeholder="Movie title..." onChange={(e) => setNewMovieTitle(e.target.value)}/>
        <input placeholder="Release Date..." type="number" onChange={(e) => setNewReleaseDate(Number(e.target.value))}/>
        <input type="checkbox" checked={isNewMovieOscar} onChange={(e) => setIsNewMovieOscar(e.target.checked)}/>
        <label>Recieved an Oscar</label>
        <button onClick={onSubmitMovie}>Submit Movie</button>
      </div>
      <div>
        {movieList.map((movie) => (
          <div>
            <h1 style={{color: movie.receivedAnOscar ? "green" : "red"}}>
              {movie.title}
            </h1>
            <p>Date: {movie.releaseDate}</p>

            <button onClick={() => deleteMovie(movie.id)}>Delete Movie</button>

            <input placeholder="new title..." onChange={(e) => setUpdateTitle(e.target.value)}/>
            <button onClick={() => updateMovieTitle(movie.id)}>Update Title</button>
          </div>
        ))}
      </div>
      <div>
        <input type="file" onChange={(e) => setFileUpload(e.target.files[0])}/>
        <button onClick={uploadFile}>Upload File</button>
      </div>
    </div>
  );
}

export default App;
