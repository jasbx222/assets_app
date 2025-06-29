import { StaticImageData } from 'next/image';

export interface Empolyee {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  phone: string;
  expiry_date: string;
  department: {
    id: string;
    name_ar: string;
    name_en: string;
    created_at: string;
    updated_at: string;
  };
  entity: {
    id: string;
    name: string;
  };
  division: {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
  };
}

export interface Entity {
  id: number;
  name: string;
}

export interface Department {
  id: number;
  name: string;
}

export interface Division {
  id: number;
  name: string;
  department: Department | null;
  assets_count: number;
}

export type EmployeeShow = {
  id: number;
  name: string;
  phone: string;
  is_active: boolean;
  expiry_date: string;
  created_at: string;
  entity: Entity;

  division: Division | null;
};
export type AssetItem = {
  id: number;
  label: string;
  status: string;
  items_length:any;
  asset: {
    id: number;
    name: string;
    image: string;
    note: string | null;
    created_at: string;
  };
  room: {
    id: number;
    name: string;
    asset_items_count: number;
    division: {
      id: number;
      name: string;
      assets_count: number;
      created_at: string;
      department: {
        id: number;
        name: string;
        created_at: string;
        entity: {
          id: number;
          name: string;
        };
      };
    };
  };
};

export type Client = {
  id: number;
  name: string;
  phone: string;
  is_active: boolean;
  expiry_date: string;
  created_at: string;
  entity: {
    id: number;
    name: string;
  };
  departmen: {
    id: number;
    name: string;
  } | null;
  division: {
    id: number;
    name: string;
  } | null;
};

type ClientResponse = {
  data: Client[];
};
export type NotificationItem = {
  id: string; // UUID
  notification: {
    title: string;
    body: string;
    report_id: number;
  };
  created_at: string;
  read_at: string | null;
};

export type DepartmentItems = {
  id: number;
  name: string;
  entity: {
    id: number;
    name: string;
  };
  created_at: string;
};

export type Asset = {
  id: number;
  name: string;
  image: any;
  note: string | null;
  created_at: string;
};
export interface AssetItemBranch {
  id: number;
  label: string;
  status: string;
  asset: {
    id: number;
    name: string;
    image: string;
    note: string;
    created_at: string;
  };
  room: {
    id: number;
    name: string;
    division: {
      id: number;
      name: string;
      department: {
        id: number;
        name: string;
        entity: {
          id: number;
          name: string;
        };
      };
    };
  };
}

export interface RoomsAssets {
  id: number;
  name: string;
  division: {
    id: number;
    name: string;
    assets_count: number;
    department: {
      id: number;
      name: string;
      entity: {
        id: number;
        name: string;
      };
    };
  };
  asset_items_count: number;
}
export type ItemDetail = {
  division?: { name?: string };
  department?: { name?: string };
  label?: string;
  status?: string;
  asset_name?: string | null;
  in_requested_room?: boolean;
};


type DepartmentShow = {
  id: number;
  name: string;
  entity: Entity;
  created_at: string;
};

type DivisionShow = {
  id: number;
  name: string;
  department: DepartmentShow;
  assets_count: number;
  created_at: string;
};

type ClientShow = {
  id: number;
  name: string;
  phone: string;
  is_active: boolean;
  expiry_date: string;
  created_at: string;
  entity: Entity;
  departmen: any | null;
  division: DivisionShow;
};

type Room = {
  id: number;
  name: string;
  division: DivisionShow;
  asset_items_count: number;
};

type Stats = {
  new_count: number;
  found_count: number;
  labels_count: number;
  damaged_count: number;
  unknown_count: number;
  other_room_count: number;
};

type ResultType = {
  stats: Stats;
  items_details: ItemDetail[];
};

export type Report = {
  id: number;
  client: ClientShow;
  room: Room;
  result: ResultType;
  created_at: string;
};
