import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PinnedGroupsService {
  private readonly STORAGE_KEY = 'pinned_groups';
  private pinnedGroups = new BehaviorSubject<string[]>([]);

  constructor() {
    this.loadPinnedGroups();
  }

  private loadPinnedGroups(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.pinnedGroups.next(JSON.parse(stored));
    }
  }

  getPinnedGroups(): Observable<string[]> {
    return this.pinnedGroups.asObservable();
  }

  getLastPinnedGroup(): string | null {
    const pinned = this.pinnedGroups.value;
    return pinned.length > 0 ? pinned[pinned.length - 1] : null;
  }

  togglePinGroup(groupName: string): void {
    const currentPinned = this.pinnedGroups.value;
    const newPinned = currentPinned.includes(groupName)
      ? currentPinned.filter((name) => name !== groupName)
      : [...currentPinned, groupName];

    this.pinnedGroups.next(newPinned);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newPinned));
  }

  isGroupPinned(groupName: string): boolean {
    return this.pinnedGroups.value.includes(groupName);
  }
}
