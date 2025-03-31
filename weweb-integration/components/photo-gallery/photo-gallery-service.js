// Photo Gallery Service für LemonVows
// Diese Klasse implementiert die Logik für die Fotogalerie

import photoGalleryModel from './photo-gallery-model.json';

class PhotoGalleryService {
  constructor() {
    this.dataModel = photoGalleryModel.dataModel;
    this.defaultAlbums = photoGalleryModel.defaultAlbums;
    this.albums = [];
    this.photos = [];
    this.comments = [];
    this.shareLinks = [];
    this.maxPhotos = 50; // Standard für Free-Version
    this.maxAlbums = 3; // Standard für Free-Version
  }

  /**
   * Setzt das Limit für die maximale Anzahl an Fotos basierend auf der Preisstufe
   * @param {number} limit - Das neue Limit
   */
  setPhotoLimit(limit) {
    this.maxPhotos = limit;
  }

  /**
   * Setzt das Limit für die maximale Anzahl an Alben basierend auf der Preisstufe
   * @param {number} limit - Das neue Limit
   */
  setAlbumLimit(limit) {
    this.maxAlbums = limit;
  }

  /**
   * Prüft, ob das Fotolimit erreicht ist
   * @returns {boolean} - True, wenn das Limit erreicht ist, sonst False
   */
  isPhotoLimitReached() {
    return this.photos.length >= this.maxPhotos;
  }

  /**
   * Prüft, ob das Albenlimit erreicht ist
   * @returns {boolean} - True, wenn das Limit erreicht ist, sonst False
   */
  isAlbumLimitReached() {
    return this.albums.length >= this.maxAlbums;
  }

  /**
   * Initialisiert die Fotogalerie mit Standardalben
   */
  initialize() {
    // Standardalben erstellen
    this.defaultAlbums.forEach(album => {
      if (this.albums.length < this.maxAlbums) {
        this.addAlbum(album);
      }
    });
    
    // Event auslösen
    this.triggerEvent('onPhotoGalleryInitialized', {
      albums: this.albums
    });
    
    return {
      albums: this.albums
    };
  }

  /**
   * Fügt ein neues Album hinzu
   * @param {Object} album - Das hinzuzufügende Album
   * @returns {Object} - Das hinzugefügte Album mit ID
   */
  addAlbum(album) {
    if (this.isAlbumLimitReached()) {
      throw new Error(`Das Albenlimit von ${this.maxAlbums} ist erreicht. Upgrade auf einen höheren Plan, um mehr Alben hinzuzufügen.`);
    }

    // Pflichtfelder prüfen
    if (!album.name) {
      throw new Error('Der Albumname ist ein Pflichtfeld');
    }

    const now = new Date();
    
    // ID generieren
    const newAlbum = {
      ...album,
      id: this.generateUniqueId('album_'),
      isPublic: album.isPublic !== undefined ? album.isPublic : false,
      createdAt: now,
      updatedAt: now
    };

    this.albums.push(newAlbum);
    
    // Event auslösen
    this.triggerEvent('onAlbumAdded', newAlbum);
    
    return newAlbum;
  }

  /**
   * Aktualisiert ein Album
   * @param {string} id - Die ID des zu aktualisierenden Albums
   * @param {Object} updatedAlbum - Die aktualisierten Albumdaten
   * @returns {Object} - Das aktualisierte Album
   */
  updateAlbum(id, updatedAlbum) {
    const albumIndex = this.albums.findIndex(album => album.id === id);
    
    if (albumIndex === -1) {
      throw new Error('Album nicht gefunden');
    }
    
    const now = new Date();
    
    // Aktualisieren des Albums
    this.albums[albumIndex] = {
      ...this.albums[albumIndex],
      ...updatedAlbum,
      id, // ID beibehalten
      updatedAt: now
    };
    
    // Event auslösen
    this.triggerEvent('onAlbumUpdated', this.albums[albumIndex]);
    
    return this.albums[albumIndex];
  }

  /**
   * Entfernt ein Album
   * @param {string} id - Die ID des zu entfernenden Albums
   * @returns {boolean} - True, wenn das Album erfolgreich entfernt wurde
   */
  removeAlbum(id) {
    // Prüfen, ob Fotos in diesem Album existieren
    const photosInAlbum = this.photos.filter(photo => photo.albumId === id).length;
    
    if (photosInAlbum > 0) {
      throw new Error(`Dieses Album kann nicht entfernt werden, da es ${photosInAlbum} Fotos enthält. Bitte entfernen Sie zuerst die Fotos.`);
    }
    
    const initialLength = this.albums.length;
    this.albums = this.albums.filter(album => album.id !== id);
    
    const removed = this.albums.length < initialLength;
    
    if (removed) {
      // Auch alle Share-Links für dieses Album entfernen
      this.shareLinks = this.shareLinks.filter(link => link.albumId !== id);
      
      // Event auslösen
      this.triggerEvent('onAlbumRemoved', { id });
    }
    
    return removed;
  }

  /**
   * Setzt das Titelbild für ein Album
   * @param {string} albumId - Die ID des Albums
   * @param {string} photoId - Die ID des Fotos
   * @returns {Object} - Das aktualisierte Album
   */
  setCoverImage(albumId, photoId) {
    const album = this.getAlbumById(albumId);
    
    if (!album) {
      throw new Error('Album nicht gefunden');
    }
    
    const photo = this.getPhotoById(photoId);
    
    if (!photo) {
      throw new Error('Foto nicht gefunden');
    }
    
    // Prüfen, ob das Foto zum Album gehört
    if (photo.albumId !== albumId) {
      throw new Error('Das Foto gehört nicht zu diesem Album');
    }
    
    return this.updateAlbum(albumId, { coverImageId: photoId });
  }

  /**
   * Fügt ein neues Foto hinzu
   * @param {Object} photo - Das hinzuzufügende Foto
   * @returns {Object} - Das hinzugefügte Foto mit ID
   */
  addPhoto(photo) {
    if (this.isPhotoLimitReached()) {
      throw new Error(`Das Fotolimit von ${this.maxPhotos} ist erreicht. Upgrade auf einen höheren Plan, um mehr Fotos hinzuzufügen.`);
    }

    // Pflichtfelder prüfen
    if (!photo.url) {
      throw new Error('Die Foto-URL ist ein Pflichtfeld');
    }
    
    if (!photo.albumId) {
      throw new Error('Die Album-ID ist ein Pflichtfeld');
    }
    
    // Prüfen, ob das Album existiert
    const album = this.getAlbumById(photo.albumId);
    
    if (!album) {
      throw new Error('Das angegebene Album existiert nicht');
    }

    const now = new Date();
    
    // ID generieren
    const newPhoto = {
      ...photo,
      id: this.generateUniqueId('photo_'),
      title: photo.title || '',
      description: photo.description || '',
      thumbnailUrl: photo.thumbnailUrl || photo.url,
      tags: photo.tags || [],
      likes: photo.likes || 0,
      uploadedAt: now
    };

    this.photos.push(newPhoto);
    
    // Wenn das Album noch kein Titelbild hat, dieses Foto als Titelbild setzen
    if (!album.coverImageId) {
      this.setCoverImage(album.id, newPhoto.id);
    }
    
    // Event auslösen
    this.triggerEvent('onPhotoAdded', newPhoto);
    
    return newPhoto;
  }

  /**
   * Aktualisiert ein Foto
   * @param {string} id - Die ID des zu aktualisierenden Fotos
   * @param {Object} updatedPhoto - Die aktualisierten Fotodaten
   * @returns {Object} - Das aktualisierte Foto
   */
  updatePhoto(id, updatedPhoto) {
    const photoIndex = this.photos.findIndex(photo => photo.id === id);
    
    if (photoIndex === -1) {
      throw new Error('Foto nicht gefunden');
    }
    
    // Aktualisieren des Fotos
    this.photos[photoIndex] = {
      ...this.photos[photoIndex],
      ...updatedPhoto,
      id // ID beibehalten
    };
    
    // Event auslösen
    this.triggerEvent('onPhotoUpdated', this.photos[photoIndex]);
    
    return this.photos[photoIndex];
  }

  /**
   * Entfernt ein Foto
   * @param {string} id - Die ID des zu entfernenden Fotos
   * @returns {boolean} - True, wenn das Foto erfolgreich entfernt wurde
   */
  removePhoto(id) {
    const photo = this.getPhotoById(id);
    
    if (!photo) {
      throw new Error('Foto nicht gefunden');
    }
    
    const initialLength = this.photos.length;
    this.photos = this.photos.filter(photo => photo.id !== id);
    
    const removed = this.photos.length < initialLength;
    
    if (removed) {
      // Kommentare für dieses Foto entfernen
      this.comments = this.comments.filter(comment => comment.photoId !== id);
      
      // Wenn das Foto als Titelbild verwendet wird, das Titelbild entfernen
      const album = this.getAlbumById(photo.albumId);
      if (album && album.coverImageId === id) {
        this.updateAlbum(album.id, { coverImageId: null });
      }
      
      // Event auslösen
      this.triggerEvent('onPhotoRemoved', { id });
    }
    
    return removed;
  }

  /**
   * Fügt ein Like zu einem Foto hinzu
   * @param {string} id - Die ID des Fotos
   * @returns {Object} - Das aktualisierte Foto
   */
  likePhoto(id) {
    const photo = this.getPhotoById(id);
    
    if (!photo) {
      throw new Error('Foto nicht gefunden');
    }
    
    const updatedPhoto = this.updatePhoto(id, { likes: (photo.likes || 0) + 1 });
    
    // Event auslösen
    this.triggerEvent('onPhotoLiked', updatedPhoto);
    
    return updatedPhoto;
  }

  /**
   * Fügt einen Kommentar zu einem Foto hinzu
   * @param {Object} comment - Der hinzuzufügende Kommentar
   * @returns {Object} - Der hinzugefügte Kommentar mit ID
   */
  addComment(comment) {
    // Pflichtfelder prüfen
    if (!comment.photoId) {
      throw new Error('Die Foto-ID ist ein Pflichtfeld');
    }
    
    if (!comment.text) {
      throw new Error('Der Kommentartext ist ein Pflichtfeld');
    }
    
    // Prüfen, ob das Foto existiert
    const photo = this.getPhotoById(comment.photoId);
    
    if (!photo) {
      throw new Error('Das angegebene Foto existiert nicht');
    }

    const now = new Date();
    
    // ID generieren
    const newComment = {
      ...comment,
      id: this.generateUniqueId('comment_'),
      author: comment.author || 'Anonym',
      createdAt: now
    };

    this.comments.push(newComment);
    
    // Event auslösen
    this.triggerEvent('onCommentAdded', newComment);
    
    return newComment;
  }

  /**
   * Entfernt einen Kommentar
   * @param {string} id - Die ID des zu entfernenden Kommentars
   * @returns {boolean} - True, wenn der Kommentar erfolgreich entfernt wurde
   */
  removeComment(id) {
    const initialLength = this.comments.length;
    this.comments = this.comments.filter(comment => comment.id !== id);
    
    const removed = this.comments.length < initialLength;
    
    if (removed) {
      // Event auslösen
      this.triggerEvent('onCommentRemoved', { id });
    }
    
    return removed;
  }

  /**
   * Erstellt einen Share-Link für ein Album
   * @param {string} albumId - Die ID des Albums
   * @param {Date} expiresAt - Das Ablaufdatum des Links
   * @returns {Object} - Der erstellte Share-Link
   */
  createShareLink(albumId, expiresAt = null) {
    // Prüfen, ob das Album existiert
    const album = this.getAlbumById(albumId);
    
    if (!album) {
      throw new Error('Das angegebene Album existiert nicht');
    }

    const now = new Date();
    
    // Wenn kein Ablaufdatum angegeben ist, 30 Tage in die Zukunft setzen
    if (!expiresAt) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
    }
    
    // ID und Token generieren
    const shareLink = {
      id: this.generateUniqueId('share_'),
      albumId,
      token: this.generateToken(),
      expiresAt,
      createdAt: now
    };

    this.shareLinks.push(shareLink);
    
    // Event auslösen
    this.triggerEvent('onShareLinkCreated', shareLink);
    
    return shareLink;
  }

  /**
   * Entfernt einen Share-Link
   * @param {string} id - Die ID des zu entfernenden Share-Links
   * @returns {boolean} - True, wenn der Share-Link erfolgreich entfernt wurde
   */
  removeShareLink(id) {
    const initialLength = this.shareLinks.length;
    this.shareLinks = this.shareLinks.filter(link => link.id !== id);
    
    const removed = this.shareLinks.length < initialLength;
    
    if (removed) {
      // Event auslösen
      this.triggerEvent('onShareLinkRemoved', { id });
    }
    
    return removed;
  }

  /**
   * Prüft, ob ein Share-Link gültig ist
   * @param {string} token - Das Token des Share-Links
   * @returns {Object|null} - Das Album, wenn der Link gültig ist, sonst null
   */
  validateShareLink(token) {
    const now = new Date();
    
    // Share-Link suchen
    const shareLink = this.shareLinks.find(link => link.token === token);
    
    if (!shareLink) {
      return null;
    }
    
    // Prüfen, ob der Link abgelaufen ist
    const expiresAt = new Date(shareLink.expiresAt);
    
    if (expiresAt < now) {
      return null;
    }
    
    // Album zurückgeben
    return this.getAlbumById(shareLink.albumId);
  }

  /**
   * Ruft ein Album anhand seiner ID ab
   * @param {string} id - Die ID des Albums
   * @returns {Object|null} - Das Album oder null, wenn nicht gefunden
   */
  getAlbumById(id) {
    return this.albums.find(album => album.id === id) || null;
  }

  /**
   * Ruft alle Alben ab
   * @returns {Array} - Alle Alben
   */
  getAllAlbums() {
    return [...this.albums];
  }

  /**
   * Ruft öffentliche Alben ab
   * @returns {Array} - Öffentliche Alben
   */
  getPublicAlbums() {
    return this.albums.filter(album => album.isPublic);
  }

  /**
   * Ruft ein Foto anhand seiner ID ab
   * @param {string} id - Die ID des Fotos
   * @returns {Object|null} - Das Foto oder null, wenn nicht gefunden
   */
  getPhotoById(id) {
    return this.photos.find(photo => photo.id === id) || null;
  }

  /**
   * Ruft alle Fotos ab
   * @returns {Array} - Alle Fotos
   */
  getAllPhotos() {
    return [...this.photos];
  }

  /**
   * Ruft Fotos für ein Album ab
   * @param {string} albumId - Die ID des Albums
   * @returns {Array} - Fotos für das Album
   */
  getPhotosForAlbum(albumId) {
    return this.photos.filter(photo => photo.albumId === albumId);
  }

  /**
   * Ruft Kommentare für ein Foto ab
   * @param {string} photoId - Die ID des Fotos
   * @returns {Array} - Kommentare für das Foto
   */
  getCommentsForPhoto(photoId) {
    return this.comments.filter(comment => comment.photoId === photoId);
  }

  /**
   * Ruft Share-Links für ein Album ab
   * @param {string} albumId - Die ID des Albums
   * @returns {Array} - Share-Links für das Album
   */
  getShareLinksForAlbum(albumId) {
    return this.shareLinks.filter(link => link.albumId === albumId);
  }

  /**
   * Sucht Fotos anhand von Tags oder Text
   * @param {string} query - Die Suchanfrage
   * @returns {Array} - Gefundene Fotos
   */
  searchPhotos(query) {
    if (!query) {
      return [];
    }
    
    const lowerQuery = query.toLowerCase();
    
    return this.photos.filter(photo => {
      // Nach Titel suchen
      if (photo.title && photo.title.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      
      // Nach Beschreibung suchen
      if (photo.description && photo.description.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      
      // Nach Tags suchen
      if (photo.tags && photo.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) {
        return true;
      }
      
      return false;
    });
  }

  /**
   * Generiert eine eindeutige ID
   * @param {string} prefix - Das Präfix für die ID
   * @returns {string} - Eine eindeutige ID
   */
  generateUniqueId(prefix = 'gallery_') {
    return prefix + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Generiert ein zufälliges Token
   * @returns {string} - Ein zufälliges Token
   */
  generateToken() {
    return Math.random().toString(36).substr(2, 16);
  }

  /**
   * Hilfsfunktion zum Auslösen von Events
   * @param {string} eventName - Der Name des Events
   * @param {any} data - Die Eventdaten
   */
  triggerEvent(eventName, data) {
    const event = new CustomEvent(eventName, { detail: data });
    document.dispatchEvent(event);
  }
}

// Exportieren des PhotoGalleryService
export default new PhotoGalleryService();
