// Custom MediaTomb import script.

function addAudio(obj) {
 
    var title, artist, album, albumartist, genre, chain;


    // Define metadata variables
    title = obj.meta[M_TITLE] || obj.title;
    artist = obj.meta[M_ARTIST] || '[unknown]';
    album = obj.meta[M_ALBUM] || '[unknown]';
    genre = obj.meta[M_GENRE] || '[unknown]';

    // add this to config.xml to enable
    // <library-options><id3><auxdata><add-data tag="TPE2"/></auxdata></id3></library-options>
    if (obj.aux['TPE2']) {
        albumartist = obj.aux['TPE2'];
    } else {
        // if albumartist tag is not present, use artist (or Various Artist if present in path)
        if (/Various Artists/.test(obj.location)) {
            albumartist = 'Various Artists';
        } else {
            albumartist = artist;
        }
    }
    
    // Add "all songs" to artist listings
    chain = ['Audio', 'Artists', artist, '(all songs)'];
    addCdsObject(obj, createContainerChain(chain));

    // Add albums to artists listing
    chain = ['Audio', 'Artists', artist, album];
    obj.title = title;
    addCdsObject(obj, createContainerChain(chain), 'UPNP_CLASS_CONTAINER_MUSIC_ALBUM');
    
    // Add Album Artists listing
    chain = ['Audio', 'Artists (albums)', albumartist, album];
    obj.title = title;
    addCdsObject(obj, createContainerChain(chain), 'UPNP_CLASS_CONTAINER_MUSIC_ALBUM');

    // Add root Albums listing
    chain = ['Audio', 'Albums', album];
    obj.title = title; 
    addCdsObject(obj, createContainerChain(chain), 'UPNP_CLASS_CONTAINER_MUSIC_ALBUM');
    
    // Add root Genre" listing
    chain = ['Audio', 'Genre - songs', genre];
    addCdsObject(obj, createContainerChain(chain), 'UPNP_CLASS_CONTAINER_MUSIC_GENRE');
}

function addVideo(obj) {
    var chain, dir;

    chain = ['Video', 'All Video'];
    addCdsObject(obj, createContainerChain(chain));

    dir = getRootPath('object_root_path', obj.location);

    if (dir.length > 0) {
        chain = ['Video', 'Directories'];
        chain = chain.concat(dir);

        addCdsObject(obj, createContainerChain(chain));
    }
}

function addImage(obj) {

    var chain, date, dateParts, year, month, dir;
    
    chain = ['Photos', 'All Photos'];
    addCdsObject(obj, createContainerChain(chain), 'UPNP_CLASS_CONTAINER');

    date = obj.meta['M_DATE'];
    if (date) {
        dateParts = date.split('-');
        if (dateParts.length > 1) {
            year = dateParts[0];
            month = dateParts[1];

            chain = ['Photos', 'Year', year, month];
            addCdsObject(obj, createContainerChain(chain), 'UPNP_CLASS_CONTAINER');
        }

        chain = ['Photos', 'Date', date];
        addCdsObject(obj, createContainerChain(chain), 'UPNP_CLASS_CONTAINER');
    }

    dir = getRootPath('object_root_path', obj.location);

    if (dir.length > 0) {
        chain = ['Photos', 'Directories'];
        chain = chain.concat(dir);

        addCdsObject(obj, createContainerChain(chain));
    }
}


// main script part

if (getPlaylistType(orig.mimetype) === '') {
    var arr, mime, obj;
    
    arr = orig.mimetype.split('/');
    mime = arr[0];
    
    obj = orig; 
    obj.refID = orig.id;
    
    if (mime === 'audio') {
        addAudio(obj);
    }
    
    if (mime === 'video') {
        addVideo(obj);
    }
    
    if (mime === 'image') {
        addImage(obj);
    }

    if (orig.mimetype === 'application/ogg') {
        if (orig.theora === 1) {
            addVideo(obj);
        } else {
            addAudio(obj);
        }
    }
}
