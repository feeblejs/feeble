declare let invariant:invariant.InvariantStatic;

declare module "invariant" {
  export default invariant;
}

declare namespace invariant {
  interface InvariantStatic {
    (testValue:any, format?:string, ...extra:any[]):void;
  }
}
