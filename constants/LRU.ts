import AsyncStorage from '@react-native-async-storage/async-storage'
/**
 * class LRU
 */
type Node<T> = {
    value: T;
    next?:Node<T>;
    prev?:Node<T>;
}

function createNode<V>(value:V): Node<V> {
    return {value};
}


export class LRU<K,V> {
    private head?: Node<V>;
    private tail?: Node<V>;
    public capacity: number;
    private length:number;

    private lookup: Map<K,Node<V>>;
    private reverseLookup: Map<Node<V>,K>;

    constructor(capacity:number = 10, existingLRU?: LRU<K, V>){
        this.length = 0;
        this.lookup = new Map<K,Node<V>>();
        this.reverseLookup = new Map<Node<V>,K>();
        this.capacity = capacity;

        // Clone data from existing LRU if provided
        if (existingLRU) {
            const entries = existingLRU.listEntriesReversed();
            for (const { key, value } of entries) {
                this.update(key, value); // Populate new LRU with existing data
            }
        }
    }

    

    update(key:K,value:V):void{
        let node = this.lookup.get(key);
        if (!node){
            node = createNode(value);
            this.length++;
            this.prepend(node);
            this.trimCache();
            this.lookup.set(key,node);
            this.reverseLookup.set(node,key);
        } else {
            this.detach(node);
            this.prepend(node);
            node.value = value;
        }
    }

    get(key:K):V|undefined{
        // check cache for value
        const node = this.lookup.get(key);
        if (!node) return undefined;
        // move node to most recent
        this.detach(node);
        this.prepend(node);
        // return val
        return node.value;
    }

    private detach(node:Node<V>){
        if (node.prev){
            node.prev.next = node.next;
        }
        if (node.next){
            node.next.prev = node.prev;
        }

        if (this.head === node){
            this.head = node.next
        }

        if (this.tail === node){
            this.tail = node.prev
        }
        if (!this.head) {
            this.tail = undefined;
        }
    

        node.next = node.prev = undefined;
    }

    private prepend(node:Node<V>):void{
        if (this.head === undefined){
            this.head = this.tail = node;
            return;
        }
        node.next = this.head;
        if (this.head){
            this.head.prev = node;
        }
        this.head = node;
    }

    private trimCache():void{
        if (this.length <= this.capacity || !this.tail){
            return;
        }

        let oldTail = this.tail;
        this.detach(oldTail);
        const key = this.reverseLookup.get(oldTail) as K;
        this.lookup.delete(key);
        this.reverseLookup.delete(oldTail);
        this.length--;

    }

    lengthOfCache():number{
        return this.length;
    }

    ///////////////////////////////^^Base Logic^^///////////////////////////////
    ///////////////////////////////vv Async-Storage Integration vv///////////////////////////////
    async InitializeFromStorage():Promise<void>{
        try {
            const storedCache = await AsyncStorage.getItem('journalCache');
            if (storedCache){
                const cacheData: [K,V][] = JSON.parse(storedCache);
                for (const [key,value] of cacheData){
                    const node = createNode(value);
                    this.length++;
                    this.prepend(node);
                    this.lookup.set(key,node);
                    this.reverseLookup.set(node,key);
                }
                this.trimCache();
            }
        } catch (error) {
            console.error("Error loading cache from AS", error);
        }
    } 

    private saveTimeout?: NodeJS.Timeout;

async SaveCacheToStorage(): Promise<void> {
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(async () => {
        try {
            const cacheData = Array.from(this.lookup.entries()).map(([k, v]) => [k, v.value]);
            await AsyncStorage.setItem('journalCache', JSON.stringify(cacheData));
        } catch (error) {
            console.error('Error saving LRU cache to AsyncStorage', error);
        }
    }, 500); // Save after a 500ms debounce
}

    ClearCache(): void {
        this.head = undefined;
        this.tail = undefined;
        this.lookup.clear();
        this.reverseLookup.clear();
        this.length = 0;
        AsyncStorage.removeItem('journalCache').catch((error) =>
            console.error('Error clearing AsyncStorage cache', error)
        );
    }

    isEmpty(): boolean {
        return this.length === 0;
    }

    listEntries(): {key:K, value:V}[]{
        const result: {key:K, value:V}[] = [];
        let current = this.head;

        while (current){
            const key = this.reverseLookup.get(current);
            if (key){
                result.push({key, value: current.value});
            }
            current = current.next;
        }


        return result;
    }

    listEntriesReversed(): { key: K; value: V }[] {
        const result: { key: K; value: V }[] = [];
        let current = this.tail; // Start from the least recently used (tail)
    
        while (current) {
            const key = this.reverseLookup.get(current);
            if (key) {
                result.push({ key, value: current.value });
            }
            current = current.prev; // Move to the previous node
        }
    
        return result;
    }
}