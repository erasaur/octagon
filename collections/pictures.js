Pictures = new FS.Collection('pictures', {
  stores: [ new FS.Store.FileSystem('pictures') ]
});

Pictures.allow({
  insert: isAdminById,
  update: isAdminById,
  remove: isAdminById,
  download: function () {
    return true;
  }
});