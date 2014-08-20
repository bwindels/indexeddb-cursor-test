interface Promise<T>{}

interface IAsyncReader<T> {
	count(): Promise<number>
	read(offset:number, resultCallback:(result:T) => any): Promise<void>
	read(offset:number, length: number, resultCallback:(result:T) => any): Promise<void>
	readUntil(offset: number, untilCallback:(result:T) => boolean): Promise<void>
};



class IDBResultSetReader<T> implements IAsyncReader<T> {
	constructor(db:IDBDatabase, objectStoreName:string, range:any, direction:any) {

	}
}

interface Day {
	year: number
	month: number
	day: number
}

interface Person {
	name: string
	lastname: string
	gender: string
	birthday: Day
}

interface IDBPeopleStore {
	readAllPeople(): IAsyncReader<Person>
	readAllPeopleAboveAge(age:number): IAsyncReader<Person>
	storePerson(person:Person): Promise<void>
}

var store: IDBPeopleStore = null;

var reader = store.readAllPeople();
return ReaderUtil.map(reader, function(person:Person) {
	return person.name + ' ' + person.lastname;
});


interface CollectionListener<T> {
	onMoved(value:T, oldIndex:number, newIndex: number)
	onDeleted(value:T, index:number);
	onAdded(value:T, index:number);
	onChanged(value:T);
	onCountChanged(count:number)
}

interface ILiveCollectionView<T> extends IAsyncReader<T> {
	setListener(listener:CollectionListener<T>): void
	setOffset(offset:number): void
	setLength(length:number): void
}

class C