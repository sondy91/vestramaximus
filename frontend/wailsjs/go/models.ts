export namespace models {
	
	export class Account {
	    id: number;
	    name: string;
	    type: string;
	    initialBalance: number;
	    currentBalance: number;
	
	    static createFrom(source: any = {}) {
	        return new Account(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.type = source["type"];
	        this.initialBalance = source["initialBalance"];
	        this.currentBalance = source["currentBalance"];
	    }
	}
	export class Category {
	    id: number;
	    name: string;
	    type: string;
	    parentCategoryId?: number;
	
	    static createFrom(source: any = {}) {
	        return new Category(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.type = source["type"];
	        this.parentCategoryId = source["parentCategoryId"];
	    }
	}
	export class Transaction {
	    id: number;
	    // Go type: time
	    date: any;
	    amount: number;
	    type: string;
	    description: string;
	    categoryId: number;
	    accountId: number;
	    notes: string;
	    status: string;
	
	    static createFrom(source: any = {}) {
	        return new Transaction(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.date = this.convertValues(source["date"], null);
	        this.amount = source["amount"];
	        this.type = source["type"];
	        this.description = source["description"];
	        this.categoryId = source["categoryId"];
	        this.accountId = source["accountId"];
	        this.notes = source["notes"];
	        this.status = source["status"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

