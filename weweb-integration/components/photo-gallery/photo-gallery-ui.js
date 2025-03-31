// Photo Gallery UI Component für LemonVows
// Diese Komponente stellt die Benutzeroberfläche für die Fotogalerie dar

import { ref, computed, onMounted, watch } from 'vue';
import photoGalleryService from './photo-gallery-service.js';

export default {
  name: 'PhotoGalleryUI',
  
  props: {
    maxPhotos: {
      type: Number,
      default: 50
    },
    maxAlbums: {
      type: Number,
      default: 3
    },
    enableSharing: {
      type: Boolean,
      default: true
    },
    enableComments: {
      type: Boolean,
      default: true
    }
  },
  
  setup(props, { emit }) {
    // Reaktive Daten
    const albums = ref([]);
    const photos = ref([]);
    const comments = ref([]);
    const shareLinks = ref([]);
    const loading = ref(true);
    const selectedAlbum = ref(null);
    const selectedPhoto = ref(null);
    const searchQuery = ref('');
    const newAlbum = ref({
      name: '',
      description: '',
      isPublic: true
    });
    const newPhoto = ref({
      albumId: '',
      title: '',
      description: '',
      url: '',
      tags: []
    });
    const newComment = ref({
      photoId: '',
      author: '',
      text: ''
    });
    
    // Beim Mounten der Komponente
    onMounted(() => {
      // Fotolimit und Albenlimit setzen
      photoGalleryService.setPhotoLimit(props.maxPhotos);
      photoGalleryService.setAlbumLimit(props.maxAlbums);
      
      // Fotogalerie initialisieren
      photoGalleryService.initialize();
      
      // Daten laden
      loadAlbums();
      loadPhotos();
      loadComments();
      loadShareLinks();
      
      loading.value = false;
    });
    
    // Fotolimit aktualisieren, wenn sich die maxPhotos-Prop ändert
    watch(() => props.maxPhotos, (newLimit) => {
      photoGalleryService.setPhotoLimit(newLimit);
    });
    
    // Albenlimit aktualisieren, wenn sich die maxAlbums-Prop ändert
    watch(() => props.maxAlbums, (newLimit) => {
      photoGalleryService.setAlbumLimit(newLimit);
    });
    
    // Alben laden
    const loadAlbums = () => {
      albums.value = photoGalleryService.getAllAlbums();
    };
    
    // Fotos laden
    const loadPhotos = () => {
      photos.value = photoGalleryService.getAllPhotos();
    };
    
    // Kommentare laden
    const loadComments = () => {
      comments.value = photoGalleryService.comments;
    };
    
    // Share-Links laden
    const loadShareLinks = () => {
      shareLinks.value = photoGalleryService.shareLinks;
    };
    
    // Album hinzufügen
    const addAlbum = () => {
      try {
        const album = photoGalleryService.addAlbum(newAlbum.value);
        
        // Formular zurücksetzen
        newAlbum.value = {
          name: '',
          description: '',
          isPublic: true
        };
        
        // Alben neu laden
        loadAlbums();
        
        emit('album-added', album);
        
        return album;
      } catch (error) {
        console.error('Fehler beim Hinzufügen des Albums:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Album aktualisieren
    const updateAlbum = (id, updatedAlbum) => {
      try {
        const album = photoGalleryService.updateAlbum(id, updatedAlbum);
        
        // Alben neu laden
        loadAlbums();
        
        emit('album-updated', album);
        
        return album;
      } catch (error) {
        console.error('Fehler beim Aktualisieren des Albums:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Album entfernen
    const removeAlbum = (id) => {
      try {
        const removed = photoGalleryService.removeAlbum(id);
        
        if (removed) {
          // Alben neu laden
          loadAlbums();
          
          // Wenn das ausgewählte Album entfernt wurde, Auswahl zurücksetzen
          if (selectedAlbum.value && selectedAlbum.value.id === id) {
            selectedAlbum.value = null;
          }
          
          emit('album-removed', { id });
        }
        
        return removed;
      } catch (error) {
        console.error('Fehler beim Entfernen des Albums:', error);
        emit('error', error.message);
        return false;
      }
    };
    
    // Titelbild für Album setzen
    const setCoverImage = (albumId, photoId) => {
      try {
        const album = photoGalleryService.setCoverImage(albumId, photoId);
        
        // Alben neu laden
        loadAlbums();
        
        emit('cover-image-set', album);
        
        return album;
      } catch (error) {
        console.error('Fehler beim Setzen des Titelbilds:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Foto hinzufügen
    const addPhoto = () => {
      try {
        const photo = photoGalleryService.addPhoto(newPhoto.value);
        
        // Formular zurücksetzen
        newPhoto.value = {
          albumId: newPhoto.value.albumId, // Album-ID beibehalten
          title: '',
          description: '',
          url: '',
          tags: []
        };
        
        // Fotos neu laden
        loadPhotos();
        
        // Alben neu laden (wegen möglicher Titelbildänderung)
        loadAlbums();
        
        emit('photo-added', photo);
        
        return photo;
      } catch (error) {
        console.error('Fehler beim Hinzufügen des Fotos:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Foto aktualisieren
    const updatePhoto = (id, updatedPhoto) => {
      try {
        const photo = photoGalleryService.updatePhoto(id, updatedPhoto);
        
        // Fotos neu laden
        loadPhotos();
        
        emit('photo-updated', photo);
        
        return photo;
      } catch (error) {
        console.error('Fehler beim Aktualisieren des Fotos:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Foto entfernen
    const removePhoto = (id) => {
      try {
        const removed = photoGalleryService.removePhoto(id);
        
        if (removed) {
          // Fotos neu laden
          loadPhotos();
          
          // Alben neu laden (wegen möglicher Titelbildänderung)
          loadAlbums();
          
          // Wenn das ausgewählte Foto entfernt wurde, Auswahl zurücksetzen
          if (selectedPhoto.value && selectedPhoto.value.id === id) {
            selectedPhoto.value = null;
          }
          
          emit('photo-removed', { id });
        }
        
        return removed;
      } catch (error) {
        console.error('Fehler beim Entfernen des Fotos:', error);
        emit('error', error.message);
        return false;
      }
    };
    
    // Foto liken
    const likePhoto = (id) => {
      try {
        const photo = photoGalleryService.likePhoto(id);
        
        // Fotos neu laden
        loadPhotos();
        
        emit('photo-liked', photo);
        
        return photo;
      } catch (error) {
        console.error('Fehler beim Liken des Fotos:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Kommentar hinzufügen
    const addComment = () => {
      if (!props.enableComments) return null;
      
      try {
        const comment = photoGalleryService.addComment(newComment.value);
        
        // Formular zurücksetzen
        newComment.value = {
          photoId: newComment.value.photoId, // Foto-ID beibehalten
          author: newComment.value.author, // Autor beibehalten
          text: ''
        };
        
        // Kommentare neu laden
        loadComments();
        
        emit('comment-added', comment);
        
        return comment;
      } catch (error) {
        console.error('Fehler beim Hinzufügen des Kommentars:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Kommentar entfernen
    const removeComment = (id) => {
      if (!props.enableComments) return false;
      
      try {
        const removed = photoGalleryService.removeComment(id);
        
        if (removed) {
          // Kommentare neu laden
          loadComments();
          
          emit('comment-removed', { id });
        }
        
        return removed;
      } catch (error) {
        console.error('Fehler beim Entfernen des Kommentars:', error);
        emit('error', error.message);
        return false;
      }
    };
    
    // Share-Link erstellen
    const createShareLink = (albumId, expiresAt = null) => {
      if (!props.enableSharing) return null;
      
      try {
        const shareLink = photoGalleryService.createShareLink(albumId, expiresAt);
        
        // Share-Links neu laden
        loadShareLinks();
        
        emit('share-link-created', shareLink);
        
        return shareLink;
      } catch (error) {
        console.error('Fehler beim Erstellen des Share-Links:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Share-Link entfernen
    const removeShareLink = (id) => {
      if (!props.enableSharing) return false;
      
      try {
        const removed = photoGalleryService.removeShareLink(id);
        
        if (removed) {
          // Share-Links neu laden
          loadShareLinks();
          
          emit('share-link-removed', { id });
        }
        
        return removed;
      } catch (error) {
        console.error('Fehler beim Entfernen des Share-Links:', error);
        emit('error', error.message);
        return false;
      }
    };
    
    // Share-Link validieren
    const validateShareLink = (token) => {
      if (!props.enableSharing) return null;
      
      try {
        const album = photoGalleryService.validateShareLink(token);
        
        if (album) {
          emit('share-link-validated', album);
        }
        
        return album;
      } catch (error) {
        console.error('Fehler beim Validieren des Share-Links:', error);
        emit('error', error.message);
        return null;
      }
    };
    
    // Fotos suchen
    const searchPhotos = () => {
      if (!searchQuery.value) {
        return [];
      }
      
      return photoGalleryService.searchPhotos(searchQuery.value);
    };
    
    // Album auswählen
    const selectAlbum = (id) => {
      const album = photoGalleryService.getAlbumById(id);
      
      if (album) {
        selectedAlbum.value = album;
        selectedPhoto.value = null;
        
        // Foto-ID für neues Foto setzen
        newPhoto.value.albumId = id;
        
        emit('album-selected', album);
      }
      
      return album;
    };
    
    // Foto auswählen
    const selectPhoto = (id) => {
      const photo = photoGalleryService.getPhotoById(id);
      
      if (photo) {
        selectedPhoto.value = photo;
        
        // Foto-ID für neuen Kommentar setzen
        newComment.value.photoId = id;
        
        emit('photo-selected', photo);
      }
      
      return photo;
    };
    
    // Auswahl zurücksetzen
    const clearSelection = () => {
      selectedAlbum.value = null;
      selectedPhoto.value = null;
      
      emit('selection-cleared');
    };
    
    // Fotos für das ausgewählte Album
    const photosForSelectedAlbum = computed(() => {
      if (!selectedAlbum.value) return [];
      
      return photoGalleryService.getPhotosForAlbum(selectedAlbum.value.id);
    });
    
    // Kommentare für das ausgewählte Foto
    const commentsForSelectedPhoto = computed(() => {
      if (!selectedPhoto.value) return [];
      
      return photoGalleryService.getCommentsForPhoto(selectedPhoto.value.id);
    });
    
    // Share-Links für das ausgewählte Album
    const shareLinksForSelectedAlbum = computed(() => {
      if (!selectedAlbum.value) return [];
      
      return photoGalleryService.getShareLinksForAlbum(selectedAlbum.value.id);
    });
    
    // Öffentliche Alben
    const publicAlbums = computed(() => {
      return photoGalleryService.getPublicAlbums();
    });
    
    // Suchergebnisse
    const searchResults = computed(() => {
      return searchPhotos();
    });
    
    // Prüfen, ob das Fotolimit erreicht ist
    const isPhotoLimitReached = computed(() => {
      return photoGalleryService.isPhotoLimitReached();
    });
    
    // Prüfen, ob das Albenlimit erreicht ist
    const isAlbumLimitReached = computed(() => {
      return photoGalleryService.isAlbumLimitReached();
    });
    
    return {
      albums,
      photos,
      comments,
      shareLinks,
      loading,
      selectedAlbum,
      selectedPhoto,
      searchQuery,
      newAlbum,
      newPhoto,
      newComment,
      photosForSelectedAlbum,
      commentsForSelectedPhoto,
      shareLinksForSelectedAlbum,
      publicAlbums,
      searchResults,
      isPhotoLimitReached,
      isAlbumLimitReached,
      addAlbum,
      updateAlbum,
      removeAlbum,
      setCoverImage,
      addPhoto,
      updatePhoto,
      removePhoto,
      likePhoto,
      addComment,
      removeComment,
      createShareLink,
      removeShareLink,
      validateShareLink,
      selectAlbum,
      selectPhoto,
      clearSelection
    };
  },
  
  // WeWeb-spezifische Konfiguration
  weweb: {
    type: 'component',
    uiSchema: {
      ui:maxPhotos: {
        type: 'number',
        label: 'Maximale Anzahl an Fotos',
        min: 1
      },
      ui:maxAlbums: {
        type: 'number',
        label: 'Maximale Anzahl an Alben',
        min: 1
      },
      ui:enableSharing: {
        type: 'toggle',
        label: 'Teilen aktivieren'
      },
      ui:enableComments: {
        type: 'toggle',
        label: 'Kommentare aktivieren'
      }
    }
  }
};
