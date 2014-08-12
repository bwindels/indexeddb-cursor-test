var idb = (function(global) {
	
	function open(callback) {
		var version = 6;
		var request;
		try {
			request = global.indexedDB.open("people", version);
		}
		catch(err) {
			return callback(err);
		}

		request.onsuccess = function(event) {
			var db = event.target.result;
			if(!db) {
				debugger;
			}
			return callback(null, db);
		};

		request.onerror = function(event) {
			var error = event.value;
			return callback(error);
		};

		request.onupgradeneeded = function(event) {
			var db = event.target.result;
			 
			db.onerror = function(event) {
				return callback(event.value);
			};
			db.deleteObjectStore("people");
			var objectStore = db.createObjectStore("people", { keyPath: "id" });
			console.log('created object store!');
		};
	}

	function PeopleStore(db) {
		this.db = db;
	}

	PeopleStore.prototype = {
		writePeople: function(personsIterator, callback) {
			var db = this.db;
			var transaction;
			try {
				transaction = db.transaction(['people'], "readwrite");
			}
			catch(err) {
				return callback(err);
			}
			var store = transaction.objectStore('people');

			function handleError(event) {
				return callback(event.value);
			}

			function addNext() {
				if(!personsIterator.hasNext()) {
					return callback();
				}
				else {
					var data = personsIterator.next();
					var request;
					try {
						request = store.put(data);
					}
					catch(err) {
						return callback(err);
					}
					request.onsuccess = addNext;
					request.onerror = handleError;
				}
			}

			addNext();
		},

		readPeople: function(offset, length, totalCountCallback, callback) {
			var db = this.db;
			var transaction = db.transaction(['people'], "readonly");
			var store = transaction.objectStore('people');

			var keyRange = IDBKeyRange.lowerBound(0);
			var cursorRequest = store.openCursor(keyRange);

			var countRequest, count = 0;
			if(totalCountCallback) {
				countRequest = store.count(keyRange);
				countRequest.onsuccess = function(event) {
					var count = event.target.result;
					return totalCountCallback(null, count);
				};
				countRequest.onerror = function(event) {
					return totalCountCallback(event.value);
				};
			}

			var hasSkipped = offset === 0;
			var remaining = length;

			cursorRequest.onsuccess = function (event) {
				var cursor = event.target.result;
				if(cursor) {
					if(!hasSkipped) {
						cursor.advance(offset);
						hasSkipped = true;
						return;
					}

					callback(null, cursor.value);
					--remaining;
					if(remaining > 0) {
						cursor.continue();
					}
				}
			};

			cursorRequest.onerror = function(event) {
				var error = event.value;
				return callback(error);
			};
		},

		close: function () {
			this.db.close();
		}

	};

	return {
		open: function(callback) {
			open(function(err, db) {
				if(err) {
					return callback(err);
				}
				return callback(null, new PeopleStore(db));
			});
		}
	};

})(this);